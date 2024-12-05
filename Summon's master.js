on("chat:message", function(msg) {
    if (msg.type !== "api" || !msg.content.startsWith("!summon")) return;

    var content = msg.content.slice("!summon".length).trim();

    // Initialize settings
    state.SUMMON = state.SUMMON || {};
    state.SUMMON.config = state.SUMMON.config || {
        silentDefault: false
    };

    // Check for --help or --config commands
    if (content.startsWith("--help")) {
        showHelpMenu(msg.who);
        return;
    } else if (content.startsWith("--config")) {
        showConfigMenu(msg.who, content);
        return;
    }

    // Function to process dice rolls in a string
    function processDiceExpressions(str) {
        return str.replace(/(\d+)?[dт]\d+([+-]\d+)?/gi, function(match) {
            var diceRoll = match.match(/^(\d+)?[dт](\d+)([+-]\d+)?$/i);
            if (diceRoll) {
                var numDice = parseInt(diceRoll[1]) || 1;
                var dieSize = parseInt(diceRoll[2]);
                var modifier = parseInt(diceRoll[3]) || 0;
                var total = 0;
                for (var i = 0; i < numDice; i++) {
                    total += randomInteger(dieSize);
                }
                total += modifier;
                return total;
            } else {
                return match;
            }
        });
    }

    // Parse parameters
    function parseParameters(input) {
        var params = {};
        var regex = /--(\w+)\|(".*?"|[^\s]+)|--(\w+)/g;
        var match;
        while ((match = regex.exec(input)) !== null) {
            if (match[1]) {
                // Parameter with value
                var key = match[1];
                var value = match[2];
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length -1);
                }
                // Process dice rolls in value
                value = processDiceExpressions(value);
                params[key.toLowerCase()] = value;
            } else if (match[3]) {
                // Flag without value
                params[match[3].toLowerCase()] = true;
            }
        }
        return params;
    }

    var params = parseParameters(content);

    // Set default values
    var name = params['name'];
    if (!name) {
        sendChat(msg.who, "/w " + msg.who + " Monster name not provided. Use --name|Monster_Name");
        return;
    }
    var count = params['count'] || "1";
    var position = params['position'] || "1d8";
    var sizeParam = params['size'] || "M";

    var selFlag = params.hasOwnProperty('sel');
    var tokenId = params['ids'];
    var silent = params.hasOwnProperty('silent') || state.SUMMON.config.silentDefault;

    // Handle table in the name parameter
    var tableRoll = name.match(/^(\d+)?t\[(.+)\]$/i);
    if (tableRoll) {
        var tableTimes = parseInt(tableRoll[1]) || 1;
        var tableName = tableRoll[2];

        var rollTable = findObjs({type: 'rollabletable'}).find(t => t.get('name').toLowerCase() === tableName.toLowerCase());
        if (!rollTable) {
            sendChat(msg.who, "/w " + msg.who + " Table \"" + tableName + "\" not found.");
            return;
        }

        var tableItems = findObjs({type: 'tableitem', rollabletableid: rollTable.id});
        var namesFromTable = [];
        for (var i = 0; i < tableTimes; i++) {
            var totalWeight = tableItems.reduce((sum, item) => sum + item.get('weight'), 0);
            var roll = randomInteger(totalWeight);
            var cumulativeWeight = 0;
            for (var j = 0; j < tableItems.length; j++) {
                cumulativeWeight += tableItems[j].get('weight');
                if (roll <= cumulativeWeight) {
                    namesFromTable.push(tableItems[j].get('name'));
                    break;
                }
            }
        }
        name = namesFromTable.join(", ");
    }

    // Handle count
    count = processDiceExpressions(count);
    var amount = parseInt(count);
    if (isNaN(amount) || amount < 1) {
        sendChat(msg.who, "/w " + msg.who + " Invalid or too small count value: " + count);
        return;
    }

    if (amount > 20) {
        sendChat(msg.who, "/w " + msg.who + " You cannot summon more than 20 creatures at a time. Set to 20.");
        amount = 20;
    }

    // Handle position (including dice rolls)
    position = processDiceExpressions(position);
    var posVal = parseInt(position);
    if (isNaN(posVal) || posVal < 0 || posVal > 8) {
        // If result is invalid, default position is 0
        posVal = 0;
    }

    // Handle size (including dice rolls)
    sizeParam = processDiceExpressions(sizeParam);
    if (/^\d+$/.test(sizeParam)) {
        var sizeNumber = parseInt(sizeParam);
        var sizeCodes = ['F', 'D', 'T', 'S', 'M', 'L', 'H', 'G', 'C'];
        var sizeIndex = sizeNumber % sizeCodes.length;
        sizeParam = sizeCodes[sizeIndex];
    } else {
        sizeParam = sizeParam.toUpperCase();
    }

    // Function to find character by name, case insensitive
    function findCharacterByName(charName) {
        var chars = findObjs({_type:"character"});
        return chars.find(c => c.get('name').toLowerCase() === charName.toLowerCase());
    }

    var characterNames = name.split(",").map(n => n.trim());
    var characters = [];
    for (var idx = 0; idx < characterNames.length; idx++) {
        var charName = characterNames[idx];
        var character = findCharacterByName(charName);
        if (!character) {
            sendChat(msg.who, "/w " + msg.who + " Monster with the name \"" + charName + "\" not found.");
            return;
        }
        characters.push(character);
    }

    // Determine reference token
    var referenceToken = null;
    if (tokenId) {
        referenceToken = getObj("graphic", tokenId);
        if (!referenceToken) {
            sendChat(msg.who, "/w " + msg.who + " Token with id '" + tokenId + "' not found.");
            return;
        }
    } else if (selFlag && msg.selected && msg.selected.length > 0) {
        var selObj = msg.selected[0];
        referenceToken = getObj("graphic", selObj._id);
        if (!referenceToken) {
            sendChat(msg.who, "/w " + msg.who + " Selected token not found.");
            return;
        }
    } else if (msg.selected && msg.selected.length > 0) {
        var selObj = msg.selected[0];
        referenceToken = getObj("graphic", selObj._id);
        if (!referenceToken) {
            sendChat(msg.who, "/w " + msg.who + " Selected token not found.");
            return;
        }
    } else {
        sendChat(msg.who, "/w " + msg.who + " No token specified (--ids or --sel) and no token selected.");
        return;
    }

    var refTokenWidth = referenceToken.get("width");
    var refTokenHeight = referenceToken.get("height");

    var sizeMap = {
        'F': 0.5,
        'D': 0.5,
        'T': 0.5,
        'S': 0.5,
        'M': 1,
        'L': 2,
        'H': 3,
        'G': 4,
        'C': 6
    };
    var summonedTokenScale = 1;

    var page = getObj("page", referenceToken.get("pageid"));
    var gridIncrement = page.get("snapping_increment") * 70;

    var summonedTokenWidth, summonedTokenHeight;
    if (sizeParam in sizeMap) {
        summonedTokenScale = sizeMap[sizeParam];
        summonedTokenWidth = summonedTokenScale * gridIncrement;
        summonedTokenHeight = summonedTokenScale * gridIncrement;
    } else if (sizeParam.toLowerCase() === 'cust') {
        var customSizes = content.match(/--size\|cust\s+(\d+)\s+(\d+)/i);
        if (customSizes) {
            summonedTokenWidth = parseInt(customSizes[1]);
            summonedTokenHeight = parseInt(customSizes[2]);
        } else {
            sendChat(msg.who, "/w " + msg.who + " Please specify two numbers after 'cust' in --size|cust [width] [height]");
            return;
        }
    } else {
        sendChat(msg.who, "/w " + msg.who + " Invalid size parameter value: " + sizeParam);
        return;
    }

    // Calculate positions considering sizes in grid units
    var refLeft = referenceToken.get("left") - (refTokenWidth / 2);
    var refTop = referenceToken.get("top") - (refTokenHeight / 2);

    // Calculate sizes and positions in grid units
    var refGridX = Math.round(refLeft / gridIncrement);
    var refGridY = Math.round(refTop / gridIncrement);

    var refSizeX = refTokenWidth / gridIncrement;
    var refSizeY = refTokenHeight / gridIncrement;

    var sumSizeX = summonedTokenWidth / gridIncrement;
    var sumSizeY = summonedTokenHeight / gridIncrement;

    function calculateGridOffsets(posCode, refSizeX, refSizeY, sumSizeX, sumSizeY) {
        var positions = {
            '0': {dx:0, dy:0},
            '1': {dx:0, dy:-sumSizeY},
            '2': {dx:refSizeX, dy:-sumSizeY},
            '3': {dx:refSizeX, dy:0},
            '4': {dx:refSizeX, dy:refSizeY},
            '5': {dx:0, dy:refSizeY},
            '6': {dx:-sumSizeX, dy:refSizeY},
            '7': {dx:-sumSizeX, dy:0},
            '8': {dx:-sumSizeX, dy:-sumSizeY}
        };
        return positions[posCode.toString()] || {dx:0, dy:0};
    }

    var gridOffsets = calculateGridOffsets(posVal, refSizeX, refSizeY, sumSizeX, sumSizeY);

    var sumGridX = refGridX + gridOffsets.dx;
    var sumGridY = refGridY + gridOffsets.dy;

    var baseLeft = (sumGridX * gridIncrement) + (summonedTokenWidth / 2);
    var baseTop = (sumGridY * gridIncrement) + (summonedTokenHeight / 2);

    for (var i = 0; i < amount; i++) {
        var tokenLeft = baseLeft + (i % 5) * gridIncrement;
        var tokenTop = baseTop + Math.floor(i / 5) * gridIncrement;
        var character = characters[i % characters.length];

        (function(character, tokenLeft, tokenTop) {
            character.get('defaulttoken', function(defaultTokenData) {
                var tokenProps;
                if (defaultTokenData) {
                    try {
                        var defaultToken = JSON.parse(defaultTokenData);
                        if (Array.isArray(defaultToken)) {
                            defaultToken = defaultToken[0];
                        }
                        tokenProps = _.clone(defaultToken);
                        delete tokenProps._id;
                        delete tokenProps._type;
                        tokenProps.left = tokenLeft;
                        tokenProps.top = tokenTop;
                        tokenProps.pageid = referenceToken.get("pageid");
                        tokenProps.layer = "objects";
                        tokenProps.width = summonedTokenWidth;
                        tokenProps.height = summonedTokenHeight;

                        if (tokenProps.imgsrc) {
                            var imgsrc = tokenProps.imgsrc;
                            if (!/^https?:\/\//.test(imgsrc)) {
                                imgsrc = 'https://s3.amazonaws.com/files.d20.io/images/' + imgsrc;
                            }
                            imgsrc = imgsrc.replace(/(med|thumb|original|max)/, 'thumb');
                            imgsrc = imgsrc.replace(/\?.*$/, '');
                            imgsrc += '?thumb=1';
                            tokenProps.imgsrc = imgsrc;
                        }
                    } catch (e) {
                        sendChat(msg.who, "/w " + msg.who + " Error processing default token of character \"" + character.get('name') + "\".");
                        log("Error parsing default token: " + e.message);
                        return;
                    }
                } else {
                    var characterImage = character.get('avatar');
                    if (!characterImage) {
                        sendChat(msg.who, "/w " + msg.who + " Monster \"" + character.get('name') + "\" does not have an avatar image.");
                        return;
                    }
                    if (characterImage.indexOf("marketplace") !== -1) {
                        sendChat(msg.who, "/w " + msg.who + " Monster \""  + character.get('name') + "\" uses an image from Marketplace.");
                        return;
                    }
                    var imgsrc = characterImage;
                    imgsrc = imgsrc.replace(/(med|thumb|original|max)/, 'thumb');
                    imgsrc = imgsrc.replace(/\?.*$/, '');
                    imgsrc += '?thumb=1';

                    tokenProps = {
                        imgsrc: imgsrc,
                        represents: character.id,
                        name: character.get('name'),
                        left: tokenLeft,
                        top: tokenTop,
                        width: summonedTokenWidth,
                        height: summonedTokenHeight,
                        pageid: referenceToken.get("pageid"),
                        layer: "objects"
                    };
                }

                createObj('graphic', tokenProps);
            });
        })(character, tokenLeft, tokenTop);
    }

    if (!silent) {
        var action = "Summons ";
        var amountStr = amount.toString();
        sendChat(msg.who, action + amountStr + " " + name + "!");
    }

    function showHelpMenu(who) {
        var helpMessage = "/w " + who + " "
            + "<div style='border: 1px solid black; padding: 5px;'>"
            + "<h3>Summon's master Help</h3>"
            + "<p>Use the following syntax to summon creatures:</p>"
            + "<pre>!summon --name|\"Monster Name\" [options]</pre>"
            + "<li><b>--name|The name of the monster from the Journal</b>: Summon creatures from a rollable table.The person entering the command must have this creature available in the Journal.</li>"
            + "<p><b>Options (all optional). Can use dice notation:</b></p>"
            + "<ul>"
            + "<li><b>--count|[number/formula]</b>: Number of creatures (default is 1).</li>"
            + "<li><b>--position|[number/formula]</b>: Position (default is 1d8) relative to the selected token. Where 0 is the center of the selected token, 1 is north, 2 is northeast and so on clockwise</li>"
            + "<li><b>--size|[F/D/T/S/M/L/H/G/C/number/formula]</b>: Size (default is M). Can use formulas with dice, number will be converted to a size code. F= Fine, D = Diminutive, T= Tiny, L = large, H = Huge, G = Gargantuan, C = Colossal</li>"
            + "<li><b>--silent</b>: Disables the summoning message.</li>"
            + "<li><b>--ids|[token_id]</b>: Use token ID as reference point.</li>"
            + "<li><b>--sel</b>: Use selected token as reference point.</li>"
            + "</ul>"
            + "<p>If no parameters are specified, default values are used:</p>"
            + "<ul>"
            + "<li><b>--count</b>: 1</li>"
            + "<li><b>--position</b>: 1d8 (random position)</li>"
            + "<li><b>--size</b>: M (medium size)</li>"
            + "</ul>"
            + "<p><b>Example:</b></p>"
            + "<pre>!summon --name|\"1t[Random-Monster]\" --count|1d4 --position|1d8 --size|1d6</pre>"
            + "<p>Summons 1d4 random monsters, with random position and size.</p>"
            + "</div>";
        sendChat("Summoning Script", helpMessage);
    }

    function showConfigMenu(who, content) {
        var configParams = parseParameters(content.slice("--config".length).trim());
        if (Object.keys(configParams).length > 0) {
            if (configParams.hasOwnProperty('silentdefault')) {
                state.SUMMON.config.silentDefault = configParams['silentdefault'] === 'true';
            }
            sendChat("Summoning Script", "/w " + who + " Settings updated.");
        }

        var configMessage = "/w " + who + " "
            + "<div style='border: 1px solid black; padding: 5px;'>"
            + "<h3>Summoning Script Settings</h3>"
            + "<p>Current settings:</p>"
            + "<ul>"
            + "<li><b>Silent Mode by default:</b> " + (state.SUMMON.config.silentDefault ? "Enabled" : "Disabled") + "</li>"
            + "</ul>"
            + "<p>To change settings, use:</p>"
            + "<pre>!summon --config --silentDefault|true</pre>"
            + "<p>Available parameters:</p>"
            + "<ul>"
            + "<li><b>--silentDefault|[true/false]</b>: Sets Silent mode as default.</li>"
            + "</ul>"
            + "</div>";
        sendChat("Summoning Script", configMessage);
    }
});
