on("ready",function(){
    state.SUMMON = state.SUMMON || {};
    state.SUMMON.config = state.SUMMON.config || {};
    if(typeof state.SUMMON.config.silentDefault === 'undefined') {
        state.SUMMON.config.silentDefault = false;
    }
    if(!state.SUMMON.config.cellSize || state.SUMMON.config.cellSize<1) {
        state.SUMMON.config.cellSize=70;
    }
    if(!state.SUMMON.config.locale) {
        state.SUMMON.config.locale='ru';
    }
    state.SUMMON.formations = state.SUMMON.formations || {};
});

on("chat:message", function(msg) {
    if (msg.type !== "api" || !msg.content.startsWith("!SM")) return;

    let originalContent = msg.content.slice("!SM".length).trim();
    let content = handleInlineRollExpansions(originalContent, msg.inlinerolls||[]);

    // Дополнительно обрабатываем 1t[TableName]
    content = replaceTableExpressions(content);

    const playerid = msg.playerid;
    const player = getObj('player', playerid);
    const who = (player ? player.get('displayname') : msg.who) || msg.who;
    const isGM = playerIsGM(playerid);

    // ---------------------- Оформление / утилиты ----------------------
    const openReport = "<div style='border:1px solid #000; background:#ccc; padding:5px; font-size:90%;'>";
    const closeReport = "</div>";
    const openHeader = "<div style='font-weight:bold; background:#404040; color:#fff; padding:3px; margin-bottom:5px;'>";
    const closeHeader = "</div>";
    function btn(label, cmd) {
        return "<a href='"+cmd+"' style='background:#404040; color:#eee; padding:2px 5px; border-radius:5px; text-decoration:none; margin-right:5px;'>"+label+"</a>";
    }
    function sendWhisper(who, html) {
        sendChat("Summon Script","/w "+who+" "+html);
    }

    // ---------------------- Тексты ----------------------
    const texts = {
        'ru': {
            helpTitle:"Summon Script — Справка",
            mainCommands:"Основные команды:",
            summonExample:"Пример призыва:",
            summonExampleUsage:"!SM --summon name|\"Орк\" count|1d4 name|\"Гоблин\" count|2 radius|30",
            extendedSummon:"Призовёт нескольких существ (Орков и Гоблинов) вокруг выделенного токена или в радиусе 30, если нет токена.",
            paramListTitle:"Список ключевых аргументов для --summon:",
            paramListItems:[
                "name|\"Имя\" — указывает имя (можно несколько блоков name|...).",
                "count|число/кубы — сколько штук призвать (1d4 и т.д.).",
                "radius|число — радиус (в футах) от границы токена (учёт размеров!).",
                "position|0-8 — разместить токен вплотную к референсному.",
                "barX|число(+) — установить значение для полоски X (bar1, bar2...). + в конце делает её видимой.",
                "showname — показать имя призванного токена игрокам.",
                "sound|\"Название\" — проиграть трек/звук из Roll20.",
                "nosound — не проигрывать звук (если прописан sound).",
                "silent — скрыть сообщения об ошибках или призыве.",
                "size|F/D/T/S/M/L/H/G/C — задать размер токена (кубы тоже можно).",
                "fx|\"beam-fire;source=ref,0,-1;target=3,0\" — эффекты. source/target=ref = координаты токена.",
                "move|to-front/to-back — переместить токен над/под другими.",
                "ids|SomeID/Name — взять токен по ID или по имени (если несколько — случайно).",
                "overlap|\"Сообщение\" — разрешить призыв даже в занятую клетку, вывести сообщение."
            ],
            groupParam:"--group|Имя: Призвать сохранённую формацию",
            savingFormations:"Сохранение и вызов формаций:",
            savingExample:"Добавьте --save|Имя в конец, затем !SM --menu или !SM --group|Имя.",
            unknownCommand:"Неизвестная команда. Используйте --help.",
            damagedFormation:"Формация повреждена, не могу призвать.",
            noFormation:"Нет такой формации.",
            needToken:"Нужен выделенный токен или radius/position.",
            noPlace:"Не удалось найти место.",
            noCreature:"Персонаж не найден",
            summoned:"призвано",
            noSpaceRadius:"Нет места в радиусе.",
            selectTokenOrRadius:"Выберите токен или укажите radius/position.",
            formationSaved:"Формация сохранена!",
            configTitle:"Настройки (только ГМ)",
            silentCurrent:"silentDefault:",
            cellSizeCurrent:"cellSize:",
            enableSilent:"Включить silent",
            disableSilent:"Выключить silent",
            changeCell:"Изменить размер клетки",
            onlyGM:"Только ГМ может настраивать.",
            noFormations:"Нет сохранённых формаций.",
            addFormation:"Добавить новую формацию",
            savedFormations:"Сохранённые формации:",
            summonLabel:"▶️",
            deleteLabel:"🗑️",
            editLabel:"✏️",
            playingSound:"Играет звук:",
            localeCurrent:"Текущая локаль:",
            changeToRU:"На русский",
            changeToEN:"На английский",
            localeSwitched:"Локаль успешно изменена на:"
        },
        'en': {
            helpTitle:"Summon Script — Help",
            mainCommands:"Main Commands:",
            summonExample:"Summon example:",
            summonExampleUsage:"!SM --summon name|\"Orc\" count|1d4 name|\"Goblin\" count|2 radius|30",
            extendedSummon:"Summons multiple creatures around the selected token or within 30ft if no token is selected.",
            paramListTitle:"Key arguments for --summon:",
            paramListItems:[
                "name|\"Name\" — sets creature name.",
                "count|number/dice — how many to summon (1d4 etc.).",
                "radius|number — radius (feet) from the token's boundary (size included).",
                "position|0-8 — place the new token adjacent to the ref token.",
                "barX|number(+) — set barX (bar1, bar2...). + shows it to players.",
                "showname — show the token's name to players.",
                "sound|\"Track\" — play a Roll20 jukebox track.",
                "nosound — skip playing sound.",
                "silent — suppress messages.",
                "size|F/D/T/S/M/L/H/G/C — set token size (dice possible).",
                "fx|\"beam-fire;source=ref,0,-1;target=3,0\" — spawn effects.",
                "move|to-front/to-back — bring token forward or backward.",
                "ids|SomeID/Name — use a specific token ID or random by name.",
                "overlap|\"Message\" — allow summoning into occupied cell + output message."
            ],
            groupParam:"--group|Name: Summon a saved formation",
            savingFormations:"Saving & recalling formations:",
            savingExample:"Add --save|Name, then !SM --menu or !SM --group|Name.",
            unknownCommand:"Unknown command. Use --help.",
            damagedFormation:"Formation is damaged, can't summon.",
            noFormation:"No such formation.",
            needToken:"Need a selected token or radius/position.",
            noPlace:"No space found.",
            noCreature:"Character not found",
            summoned:"summoned",
            noSpaceRadius:"No space in radius.",
            selectTokenOrRadius:"Select a token or specify radius/position.",
            formationSaved:"Formation saved!",
            configTitle:"Settings (GM only)",
            silentCurrent:"silentDefault:",
            cellSizeCurrent:"cellSize:",
            enableSilent:"Enable silent",
            disableSilent:"Disable silent",
            changeCell:"Change cell size",
            onlyGM:"Only GM can configure.",
            noFormations:"No saved formations.",
            addFormation:"Add new formation",
            savedFormations:"Saved formations:",
            summonLabel:"▶️",
            deleteLabel:"🗑️",
            editLabel:"✏️",
            playingSound:"Playing sound:",
            localeCurrent:"Current locale:",
            changeToRU:"Switch to Russian",
            changeToEN:"Switch to English",
            localeSwitched:"Locale successfully changed to:"
        }
    };
    function getT(){
        return texts[state.SUMMON.config.locale||'ru'];
    }

    // ---------------------- Смена локали ----------------------
    const matchLocale = content.match(/--locale\|(ru|en)/i);
    if(matchLocale){
        state.SUMMON.config.locale = matchLocale[1].toLowerCase();
        content = content.replace(/--locale\|(ru|en)/i,'').trim();
        let t = getT();
        sendWhisper(who, openReport+t.localeSwitched+" "+state.SUMMON.config.locale+closeReport);
        return;
    }

    // ---------------------- Silent on/off ----------------------
    if(content.includes("--enableSilent")){
        if(isGM){
            state.SUMMON.config.silentDefault=true;
            content=content.replace("--enableSilent",'').trim();
        } else {
            let t=getT();
            sendWhisper(who, openReport+t.onlyGM+closeReport);
        }
    }
    if(content.includes("--disableSilent")){
        if(isGM){
            state.SUMMON.config.silentDefault=false;
            content=content.replace("--disableSilent",'').trim();
        } else {
            let t=getT();
            sendWhisper(who, openReport+t.onlyGM+closeReport);
        }
    }

    // ---------------------- cellSize ----------------------
    let cellMatch=content.match(/--cellSize\|(\d+)/i);
    if(cellMatch){
        if(isGM) {
            let newSize=parseInt(cellMatch[1]);
            if(!isNaN(newSize) && newSize>0) {
                state.SUMMON.config.cellSize=newSize;
            }
            content=content.replace(/--cellSize\|\d+/i,'').trim();
        } else {
            let t=getT();
            sendWhisper(who, openReport+t.onlyGM+closeReport);
        }
    }

    // ---------------------- processDiceExpressions ----------------------
    function processDiceExpressions(str) {
        str = String(str);
        return str.replace(/(\d+)?[dт]\d+([+-]\d+)?/gi, function(match) {
            var diceRoll = match.match(/^(\d+)?[dт](\d+)([+-]\d+)?$/i);
            if (diceRoll) {
                var numDice = parseInt(diceRoll[1])||1;
                var dieSize = parseInt(diceRoll[2]);
                var modifier = parseInt(diceRoll[3])||0;
                var total=0;
                for(var i=0;i<numDice;i++){
                    total+=randomInteger(dieSize);
                }
                total+=modifier;
                return total.toString();
            } else {
                return match;
            }
        });
    }

    // ---------------------- handleInlineRollExpansions ----------------------
    function handleInlineRollExpansions(cmd, inlinerolls) {
        if(!inlinerolls || inlinerolls.length===0){
            return cmd;
        }
        let resultCmd = cmd;
        for(let i=0; i<inlinerolls.length; i++){
            let roll = inlinerolls[i];
            let placeholder = `$[[${i}]]`;
            let replacement = "??";
            if(roll.results?.tableitems && roll.results.tableitems.length>0){
                replacement = roll.results.tableitems[0].name;
            }
            else if(roll.results?.total !== undefined){
                replacement = String(roll.results.total);
            }
            while(resultCmd.includes(placeholder)){
                resultCmd = resultCmd.replace(placeholder, replacement);
            }
        }
        return resultCmd;
    }

    // ---------------------- replaceTableExpressions (1t[Table]) ----------------------
    function replaceTableExpressions(input){
        return input.replace(/(\d+)t\[([^\]]+)\]/gi, function(match, timesStr, tableName){
            let times = parseInt(timesStr)||1;
            let results = [];
            let table = findObjs({type:'rollabletable', name:tableName})[0];
            if(!table){
                return "??(Нет таблицы '"+tableName+"')";
            }
            let items = findObjs({type:'tableitem', rollabletableid: table.id});
            let bag = [];
            items.forEach(it => {
                let w = parseInt(it.get('weight')) || 1;
                for(let i=0;i<w;i++){
                    bag.push(it.get('name'));
                }
            });
            if(bag.length===0){
                return "??(Таблица '"+tableName+"' пуста)";
            }
            for(let n=0;n<times;n++){
                let rndIndex = randomInteger(bag.length) - 1; 
                results.push(bag[rndIndex]);
            }
            return results.join(", ");
        });
    }

    // ---------------------- basicTokenize, mergeNameTokens, parseSummonCommand ----------------------
    function basicTokenize(str) {
        var regex = /"[^"]*"|'[^']*'|\S+/g;
        var matches=[];
        var m;
        while(m=regex.exec(str)){
            matches.push(m[0]);
        }
        return matches;
    }
    function mergeNameTokens(tokens){
        let merged = [];
        let i=0;
        while(i<tokens.length){
            let t = tokens[i];
            if(/^name\|["']/.test(t.toLowerCase()) && !/["']$/.test(t)){
                let combined = t;
                i++;
                while(i<tokens.length && !/["']$/.test(tokens[i])){
                    combined += " "+tokens[i];
                    i++;
                }
                if(i<tokens.length){
                    combined += " "+tokens[i];
                    i++;
                }
                merged.push(combined);
            } else {
                merged.push(t);
                i++;
            }
        }
        return merged;
    }
    function parseSummonCommand(input) {
        let reSummon = /--summon\b/i;
        if(!reSummon.test(input)) return null;
        let parts = input.split(reSummon);
        let block = (parts[1]||'').trim();
        if(!block) return null;

        let tokens = basicTokenize(block);
        tokens = mergeNameTokens(tokens);

        let summonData = [];
        let current = null;
        function pushCurrent(){
            if(current && current.name){
                summonData.push(current);
            }
        }
        for(let i=0; i<tokens.length; i++){
            let raw = tokens[i];
            let trimmed = raw.replace(/^["'](.*)["']$/,'$1');

            let lower = trimmed.toLowerCase();
            if(lower.startsWith('name|')){
                pushCurrent();
                current = { name:"", args:{} };
                let nm = trimmed.slice(5);
                nm = nm.replace(/^["'](.*)["']$/,'$1');
                current.name = nm;
            } else {
                if(!current) continue;
                let pair = trimmed.split('|');
                if(pair.length === 2){
                    let k = pair[0].toLowerCase();
                    let v = pair[1];
                    v = processDiceExpressions(v);
                    current.args[k] = v;
                } else {
                    let f = trimmed.toLowerCase();
                    current.args[f] = true;
                }
            }
        }
        pushCurrent();
        if(summonData.length===0) {
            return null;
        }
        return summonData;
    }

    // ---------------------- Roll20 вспомогательные (playSound, isAreaFree, etc.) ----------------------
    function playSound(soundName) {
        if(!soundName || soundName==="") return;
        const track = findObjs({type:'jukeboxtrack', title:soundName})[0] 
                   || findObjs({type:'jukeboxtrack', name:soundName})[0]; 
        if(track) {
            track.set('playing', true);
            track.set('softstop', false);
        } else {
            sendChat('Summon Script', "/w gm Не найден звук: " + soundName);
        }
    }

    // проверка свободности клетки (как было)
    function isAreaFree(pageid,x,y,w,h,excludeTokens,gridIncrement){
        var left=x*gridIncrement;
        var top=y*gridIncrement;
        var width=w*gridIncrement;
        var height=h*gridIncrement;

        var tokens=findObjs({type:'graphic',pageid:pageid,layer:'objects'});
        for(var i=0;i<tokens.length;i++){
            if(excludeTokens.indexOf(tokens[i].id)!==-1)continue;
            var otLeft=tokens[i].get('left')-tokens[i].get('width')/2;
            var otTop=tokens[i].get('top')-tokens[i].get('height')/2;
            var otW=tokens[i].get('width');
            var otH=tokens[i].get('height');
            var overlap=!(otLeft+otW<=left||otLeft>=left+width||otTop+otH<=top||otTop>=top+height);
            if(overlap)return false;
        }
        return true;
    }

    // Функция для вычисления расстояния от (cx, cy) до "рамки" (bounding box) референсного токена.
    // Считаем, что реф.токен занимает [refMinX..refMaxX] × [refMinY..refMaxY].
    // (cx,cy) = координаты левого верхнего угла клетки. Но мы упрощённо считаем, что клетка — точка.
    function distanceFromBox(cx, cy, refMinX, refMinY, refMaxX, refMaxY){
        let dx = 0;
        if(cx < refMinX) dx = refMinX - cx;
        else if(cx > refMaxX) dx = cx - refMaxX;

        let dy = 0;
        if(cy < refMinY) dy = refMinY - cy;
        else if(cy > refMaxY) dy = cy - refMaxY;

        return Math.sqrt(dx*dx + dy*dy);
    }

    // Генерируем все клетки в указанном радиусе (но радиус считаем от "границы" референса)
    function generateRadiusCellsAll(refMinX, refMinY, refMaxX, refMaxY, sumSizeX, sumSizeY, pageid, radiusFeet, gridIncrement) {
        var radiusCells = Math.floor(radiusFeet / 5);
        var cells = [];
        var visited = {};

        // выясним bounding box рефа
        // refMinX..refMaxX, refMinY..refMaxY уже на входе
        // пусть midX = (refMinX + refMaxX)/2, midY = ...

        // нам нужно "понять", в каких пределах cx,cy имеет смысл
        // максимально грубо: возьмём bbox рефера + radiusCells в каждую сторону
        let minX = Math.floor(refMinX - radiusCells - sumSizeX); 
        let maxX = Math.floor(refMaxX + radiusCells + sumSizeX);
        let minY = Math.floor(refMinY - radiusCells - sumSizeY);
        let maxY = Math.floor(refMaxY + radiusCells + sumSizeY);

        function addCell(cx, cy) {
            let key = cx + "_" + cy;
            if(!visited[key]){
                visited[key] = true;
                cells.push({ x: cx, y: cy });
            }
        }

        for(let cx = minX; cx <= maxX; cx++){
            for(let cy = minY; cy <= maxY; cy++){
                let dist = distanceFromBox(cx, cy, refMinX, refMinY, refMaxX, refMaxY);
                if(dist <= radiusCells) {
                    addCell(cx, cy);
                }
            }
        }
        return cells;
    }

    // ---------------------- Формирования ----------------------
    function saveFormation(playerid, name, command) {
        state.SUMMON.formations = state.SUMMON.formations || {};
        state.SUMMON.formations[playerid] = state.SUMMON.formations[playerid] || {};
        state.SUMMON.formations[playerid][name] = command;
    }
    function deleteFormation(playerid, name) {
        if(state.SUMMON.formations[playerid] && state.SUMMON.formations[playerid][name]){
            delete state.SUMMON.formations[playerid][name];
        }
    }
    function editFormation(playerid, name, newCmd) {
        if(state.SUMMON.formations[playerid] && state.SUMMON.formations[playerid][name]){
            state.SUMMON.formations[playerid][name] = newCmd;
        }
    }

    // ---------------------- Меню и справка ----------------------
    function showHelpMenu() {
        let t=getT();
        let text = openReport
        + openHeader + t.helpTitle + closeHeader
        + "<b>"+t.mainCommands+"</b><br>"
        + "<code>!SM --summon name|\"Орк\" count|1d4 name|\"Гоблин\" count|2 ...</code><br>"
        + t.summonExample+ "<br>"
        + t.summonExampleUsage + "<br><br>"
        + t.extendedSummon + "<br><br>"
        + "<b>"+t.paramListTitle+"</b><br>"
        + "<ul>";
        (t.paramListItems||[]).forEach(li=>{
            text += "<li>"+li+"</li>";
        });
        text += "</ul><br>"
        + "<b>"+t.groupParam+"</b><br><br>"
        + "<b>"+t.savingFormations+"</b><br>"
        + t.savingExample+"<br>"
        + closeReport;

        sendWhisper(who, text);
    }
    function showConfigMenu(who,isGM) {
        let t=getT();
        if(!isGM) {
            sendWhisper(who, openReport+t.onlyGM+closeReport);
            return;
        }
        let report = openReport + openHeader + t.configTitle + closeHeader
            + t.silentCurrent+" "+(state.SUMMON.config.silentDefault?"ON":"OFF")+" "
            + btn(t.enableSilent,"!SM --enableSilent")
            + btn(t.disableSilent,"!SM --disableSilent")
            + "<br>"
            + t.cellSizeCurrent+" "+state.SUMMON.config.cellSize+" "
            + btn(t.changeCell,"!SM --cellSize|?{Новый размер клетки|70}")
            + "<br>"
            + t.localeCurrent+" "+state.SUMMON.config.locale+" "
            + btn(t.changeToRU,"!SM --locale|ru")
            + btn(t.changeToEN,"!SM --locale|en")
            + closeReport;
        sendWhisper(who, report);
    }
    function showMenu() {
        let t = getT();
        let formations = state.SUMMON.formations[playerid] || {};
        let keys = Object.keys(formations);

        let report = openReport + openHeader + t.savedFormations + closeHeader;
        if(keys.length === 0) {
            report += t.noFormations;
        } else {
            keys.forEach(name => {
                report += name + " "
                    + btn(t.summonLabel, "!SM --group|" + name)
                    + btn(t.deleteLabel, "!SM --menu --delete|" + name)
                    + btn(t.editLabel, "!SM --menu --edit|" + name + "|?{Новая команда}")
                    + "<br>";
            });
        }
        report += "<br>" + btn(t.addFormation, "!SM --summon name|\"CreatureName\" count|1 --save|NewFormation");
        report += closeReport;
        sendWhisper(who, report);
    }

    // ---------------------- parseFxStringMulti ----------------------
    function parseFxStringMulti(fxString, refX, refY, gridIncrement) {
        let parts = fxString.split(';').map(s=>s.trim());
        let effects = [];
        let currentEffect = null;

        function startNewEffect(name) {
            if(currentEffect) {
                effects.push(currentEffect);
            }
            currentEffect = {effectName:name, sourceOffset:null, targetOffset:null};
        }

        for(let p of parts){
            if(p.includes('=') && (p.startsWith('source=') || p.startsWith('target='))) {
                let splitted = p.split('=');
                let paramName = splitted[0];
                let coordsStr = splitted[1];
                let subParts = coordsStr.split(',');
                if(subParts[0].toLowerCase().trim()==='ref'){
                    let dx = 0, dy=0;
                    if(subParts.length>=2) dx = parseInt(subParts[1])||0;
                    if(subParts.length>=3) dy = parseInt(subParts[2])||0;
                    if(paramName==='source'){
                        if(currentEffect) currentEffect.sourceOffset = {dx, dy, useRef:true};
                    } else {
                        if(currentEffect) currentEffect.targetOffset = {dx, dy, useRef:true};
                    }
                } else {
                    let dx = parseInt(subParts[0])||0;
                    let dy = subParts.length>1 ? parseInt(subParts[1])||0 : 0;
                    if(paramName==='source'){
                        if(currentEffect) currentEffect.sourceOffset = {dx, dy, useRef:false};
                    } else {
                        if(currentEffect) currentEffect.targetOffset = {dx, dy, useRef:false};
                    }
                }
            } else {
                startNewEffect(p);
            }
        }
        if(currentEffect) {
            effects.push(currentEffect);
        }
        return effects;
    }

    // ---------------------- doSummon: с учётом bounding box для radius/gap/position ----------------------
    function doSummon(name,args,who,pid,referenceToken){
        let t=getT();
        var pageid=referenceToken.get('pageid');
        var gridIncrement=(state.SUMMON.config.cellSize||70);

        const silent = args.silent || state.SUMMON.config.silentDefault;
        const nosound = args.nosound || false;
        const soundName = args.sound || "";
        const fxArg = args.fx || "";
        const moveArg = (args.move||"").toLowerCase().trim();
        let overlapMsg = args.overlap || null;  
        if(overlapMsg==="") overlapMsg=null; 
        var count = parseInt(args.count||"1");
        if(isNaN(count)||count<1) count=1;
        if(count>100) count=100; 

        // Ищем персонажа
        var character=findObjs({type:'character'}).find(c=>c.get('name').toLowerCase()===name.toLowerCase());
        if(!character){
            if(!silent) {
                let txt=openReport+openHeader+"Ошибка"+closeHeader+t.noCreature+" "+name+closeReport;
                sendWhisper(who,txt);
            }
            return;
        }

        // Размер референсного токена
        var refTokenWidth = referenceToken.get('width')||gridIncrement;
        var refTokenHeight= referenceToken.get('height')||gridIncrement;
        // Вычислим "гридовые" координаты левого/верхнего угла референса
        var refLeft=(referenceToken.get('left')||0)-refTokenWidth/2;
        var refTop=(referenceToken.get('top')||0)-refTokenHeight/2;
        var refGridX=(refLeft/(gridIncrement));
        var refGridY=(refTop/(gridIncrement));
        // ширина/высота референса в клетках
        var refSizeX=refTokenWidth/(gridIncrement);
        var refSizeY=refTokenHeight/(gridIncrement);

        // bounding box референсного токена (в координатах «клеток»)
        let refMinX = refGridX;
        let refMinY = refGridY;
        let refMaxX = refGridX + refSizeX;
        let refMaxY = refGridY + refSizeY;

        // Призываемый размер
        var sizeMap={'F':0.5,'D':0.5,'T':0.5,'S':0.5,'M':1,'L':2,'H':3,'G':4,'C':6};
        var sizeParam=args.size||'M';
        sizeParam=processDiceExpressions(sizeParam);
        if(/^\d+$/.test(sizeParam)){
            var sn=parseInt(sizeParam);
            var sc=['F','D','T','S','M','L','H','G','C'];
            sizeParam=sc[sn%sc.length]||'M';
        } else {
            sizeParam=sizeParam.toUpperCase();
        }
        var sumSizeX=1, sumSizeY=1;
        if(sizeMap[sizeParam]) {
            sumSizeX=sizeMap[sizeParam];
            sumSizeY=sizeMap[sizeParam];
        }

        // Функция создания одного токена
        function placeOneToken(character,args,x,y,sumSizeX,sumSizeY,pageid,gridIncrement,who){
            character.get('defaulttoken',function(dt){
                var summonedTokenWidth=sumSizeX*(gridIncrement||70);
                var summonedTokenHeight=sumSizeY*(gridIncrement||70);
                var tokenProps;
                try {
                    if(dt) {
                        var d=JSON.parse(dt);
                        if(Array.isArray(d)) d=d[0];
                        tokenProps=_.clone(d);
                    } else {
                        tokenProps={imgsrc:"https://s3.amazonaws.com/files.d20.io/images/65655/Roll20_Unknown.png?thumb=1"};
                    }
                } catch(e){
                    tokenProps={imgsrc:"https://s3.amazonaws.com/files.d20.io/images/65655/Roll20_Unknown.png?thumb=1"};
                }

                delete tokenProps._id;
                delete tokenProps._type;
                tokenProps.left=x*(gridIncrement||70)+summonedTokenWidth/2;
                tokenProps.top=y*(gridIncrement||70)+summonedTokenHeight/2;
                tokenProps.pageid=pageid;
                tokenProps.layer='objects';
                tokenProps.width=summonedTokenWidth;
                tokenProps.height=summonedTokenHeight;
                tokenProps.name=tokenProps.name || character.get('name');
                tokenProps.represents=character.id;

                // barX
                Object.keys(args).forEach(k=>{
                    if(k.startsWith('bar')) {
                        var val = String(args[k]);
                        var showBar = false;
                        if(val.endsWith('+')) {
                            showBar = true;
                            val = val.slice(0,val.length-1);
                        }
                        var barNum = k.replace('bar','');
                        var value = val;
                        var max = '';
                        if(!isNaN(value)) {
                            max = value;
                        }
                        tokenProps['bar'+barNum+'_value'] = value;
                        tokenProps['bar'+barNum+'_max'] = max;
                        if(showBar) {
                            tokenProps['showplayers_bar'+barNum] = true;
                        }
                    }
                });
                if(args.showname) {
                    tokenProps.showname = true;
                    tokenProps.showplayers_name = true;
                }

                var newToken=createObj('graphic',tokenProps);
                if(moveArg==='to-front'){
                    newToken.toFront();
                } else if(moveArg==='to-back'){
                    newToken.toBack();
                }

                // fx
                if(fxArg && pageid){
                    let realRefX = (refMinX*(gridIncrement||70) + refTokenWidth/2);
                    let realRefY = (refMinY*(gridIncrement||70) + refTokenHeight/2);
                    let effects = parseFxStringMulti(fxArg, refMinX, refMinY, gridIncrement);
                    let tokenX = newToken.get('left');
                    let tokenY = newToken.get('top');

                    effects.forEach(eff=>{
                        let fxEffect = eff.effectName;
                        let sourceX = tokenX;
                        let sourceY = tokenY;
                        let targetX = tokenX;
                        let targetY = tokenY;
                        if(eff.sourceOffset){
                            if(eff.sourceOffset.useRef){
                                let baseX = realRefX; 
                                let baseY = realRefY;
                                sourceX = baseX + eff.sourceOffset.dx*(gridIncrement||70);
                                sourceY = baseY + eff.sourceOffset.dy*(gridIncrement||70);
                            } else {
                                sourceX = tokenX + eff.sourceOffset.dx*(gridIncrement||70);
                                sourceY = tokenY + eff.sourceOffset.dy*(gridIncrement||70);
                            }
                        }
                        if(eff.targetOffset){
                            if(eff.targetOffset.useRef){
                                let baseX = realRefX; 
                                let baseY = realRefY;
                                targetX = baseX + eff.targetOffset.dx*(gridIncrement||70);
                                targetY = baseY + eff.targetOffset.dy*(gridIncrement||70);
                            } else {
                                targetX = tokenX + eff.targetOffset.dx*(gridIncrement||70);
                                targetY = tokenY + eff.targetOffset.dy*(gridIncrement||70);
                            }
                        }
                        if(eff.sourceOffset && eff.targetOffset) {
                            spawnFxBetweenPoints({x:sourceX, y:sourceY}, {x:targetX, y:targetY}, fxEffect, pageid);
                        } else if(eff.sourceOffset && !eff.targetOffset) {
                            spawnFxBetweenPoints({x:sourceX, y:sourceY}, {x:tokenX, y:tokenY}, fxEffect, pageid);
                        } else if(!eff.sourceOffset && eff.targetOffset) {
                            spawnFxBetweenPoints({x:tokenX, y:tokenY}, {x:targetX, y:targetY}, fxEffect, pageid);
                        } else {
                            spawnFx(tokenX, tokenY, fxEffect, pageid);
                        }
                    });
                }
            });
        }

        function finalSummon(coords) {
            for(var i=0;i<count;i++){
                var c=coords[i%coords.length];
                placeOneToken(character,args,c.x,c.y,sumSizeX,sumSizeY,pageid,gridIncrement,who);
            }
            if(!silent) {
                sendChat("Summon Script", character.get('name')+" "+t.summoned+" "+count+"!");
            }
            if(args.sound && !nosound) {
                playSound(args.sound);
                if(!silent) {
                    sendChat("", "/em 🎵 "+t.playingSound+" "+args.sound);
                }
            }
            if(overlapMsg){
                let msgText = processDiceExpressions(overlapMsg);
                sendChat("Summon Script", "/em "+ msgText);
            }
        }

        // --- Вычислим, какой тип призыва: position / radius / gap?

        var positionParam=args.position?parseInt(args.position):null;
        if(isNaN(positionParam)) positionParam=null;
        var radiusParam=args.radius?parseInt(args.radius):null;
        if(isNaN(radiusParam))radiusParam=null;

        // ==================== 1) position|0-8 ====================
        if(positionParam!==null){
            // Приклеиваем новый токен к границе референсного. 
            // (top, bottom, left, right, corners и т.д.)
            function placeTop(){
                // нижний край призванного = верхний край рефера
                let centerRefX = (refMinX + refMaxX)/2;
                let newX = centerRefX - sumSizeX/2;
                let newY = refMinY - sumSizeY;
                return { x: Math.round(newX), y: Math.round(newY) };
            }
            function placeBottom(){
                let centerRefX = (refMinX + refMaxX)/2;
                let newX = centerRefX - sumSizeX/2;
                let newY = refMaxY;
                return { x: Math.round(newX), y: Math.round(newY) };
            }
            function placeLeft(){
                let centerRefY = (refMinY + refMaxY)/2;
                let newY = centerRefY - sumSizeY/2;
                let newX = refMinX - sumSizeX;
                return { x: Math.round(newX), y: Math.round(newY) };
            }
            function placeRight(){
                let centerRefY = (refMinY + refMaxY)/2;
                let newY = centerRefY - sumSizeY/2;
                let newX = refMaxX;
                return { x: Math.round(newX), y: Math.round(newY) };
            }
            function placeTopLeft(){
                let newX = refMinX - sumSizeX;
                let newY = refMinY - sumSizeY;
                return { x: Math.round(newX), y: Math.round(newY) };
            }
            function placeTopRight(){
                let newX = refMaxX;
                let newY = refMinY - sumSizeY;
                return { x: Math.round(newX), y: Math.round(newY) };
            }
            function placeBottomLeft(){
                let newX = refMinX - sumSizeX;
                let newY = refMaxY;
                return { x: Math.round(newX), y: Math.round(newY) };
            }
            function placeBottomRight(){
                let newX = refMaxX;
                let newY = refMaxY;
                return { x: Math.round(newX), y: Math.round(newY) };
            }
            function placeSame(){
                // Если хотим «прямо в том же месте» (центр к центру):
                // Или "середина" = refMinX + refSizeX/2
                let centerRefX = (refMinX + refMaxX)/2 - sumSizeX/2;
                let centerRefY = (refMinY + refMaxY)/2 - sumSizeY/2;
                return { x: Math.round(centerRefX), y: Math.round(centerRefY) };
            }

            let coords;
            switch(positionParam){
                case 0: coords = placeSame(); break;
                case 1: coords = placeTop(); break;
                case 2: coords = placeTopRight(); break;
                case 3: coords = placeRight(); break;
                case 4: coords = placeBottomRight(); break;
                case 5: coords = placeBottom(); break;
                case 6: coords = placeBottomLeft(); break;
                case 7: coords = placeLeft(); break;
                case 8: coords = placeTopLeft(); break;
                default: coords = placeSame(); break;
            }
            finalSummon([coords]);
            return;
        }

        // ==================== 2) Если radiusParam указан ====================
        if(radiusParam){
            // Расстояние считаем от bounding box референса (distanceFromBox).
            // Если не хватает места, мы увеличиваем радиус на 5 и пробуем снова. 
            // (Как и было, но теперь учёт идёт от границы.)
            let currentRadius = radiusParam;
            let chosenCoords = [];
            let attempts = 0;
            while(chosenCoords.length < count && attempts < 50) {
                attempts++;
                let allCells = generateRadiusCellsAll(refMinX, refMinY, refMaxX, refMaxY, sumSizeX, sumSizeY, pageid, currentRadius, gridIncrement);
                // перемешаем
                shuffleArray(allCells);

                for(let i=0; i<allCells.length && chosenCoords.length<count; i++){
                    let cx = allCells[i].x;
                    let cy = allCells[i].y;
                    let free = isAreaFree(pageid,cx,cy,sumSizeX,sumSizeY,[],gridIncrement);
                    if(overlapMsg || free){
                        chosenCoords.push({x:cx, y:cy});
                    }
                }
                if(chosenCoords.length < count){
                    currentRadius += 5;
                }
            }
            if(chosenCoords.length===0){
                // призываем хотя бы в точку refMinX, refMinY
                chosenCoords.push({x: Math.round(refMinX), y: Math.round(refMinY)});
            }
            finalSummon(chosenCoords);
            return;
        }

        // ==================== 3) Иначе используем "gap-поиск" ====================
        // То же самое, только мы начинаем с radius=0 и наращиваем
        // (или используем какую-то логику "прилепления вокруг").
        (function(){
            let chosenCoords = [];
            let attempts = 0;
            let maxRadius = 50; // 50*5 = 250 футов
            let currentRadius = 0;
            while(chosenCoords.length < count && currentRadius <= maxRadius){
                let allCells = generateRadiusCellsAll(refMinX, refMinY, refMaxX, refMaxY, sumSizeX, sumSizeY, pageid, currentRadius, gridIncrement);
                shuffleArray(allCells);
                for(let i=0; i<allCells.length && chosenCoords.length<count; i++){
                    let cx = allCells[i].x;
                    let cy = allCells[i].y;
                    let free = isAreaFree(pageid,cx,cy,sumSizeX,sumSizeY,[],gridIncrement);
                    if(overlapMsg || free){
                        chosenCoords.push({x:cx, y:cy});
                    }
                }
                currentRadius += 5;
            }
            if(chosenCoords.length===0){
                chosenCoords.push({x: Math.round(refMinX), y: Math.round(refMinY)});
            }
            finalSummon(chosenCoords);
        })();
    }

    // ---------------------- --group ----------------------
    let groupMatch = content.match(/--group\|(.+)$/i);
    if(groupMatch) {
        let t=getT();
        let fName=groupMatch[1];
        let formations = state.SUMMON.formations[playerid]||{};
        if(!formations[fName]){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+t.noFormation+" '"+fName+"'."+closeReport;
            sendWhisper(who, txt);
            return;
        }
        let fullCmd=formations[fName];
        let summonData = parseSummonCommand(fullCmd);
        if(!summonData || summonData.length===0){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+t.damagedFormation+closeReport;
            sendWhisper(who, txt);
            return;
        }
        var sel=msg.selected;
        for(let s of summonData){
            let referenceToken = findReferenceToken(sel, s, who, t);
            if(!referenceToken) continue;
            doSummon(s.name, s.args, who, playerid, referenceToken);
        }
        return;
    }

    // ---------------------- --help ----------------------
    if(content.startsWith("--help")){
        showHelpMenu();
        return;
    }

    // ---------------------- --config ----------------------
    if(content.startsWith("--config")){
        showConfigMenu(who,isGM);
        return;
    }

    // ---------------------- --menu ----------------------
    if(content.startsWith("--menu")){
        let delMatch=content.match(/--delete\|(.+)$/i);
        if(delMatch){
            deleteFormation(playerid, delMatch[1]);
        }
        let editMatch=content.match(/--edit\|([^|]+)\|(.*)$/i);
        if(editMatch){
            editFormation(playerid, editMatch[1], editMatch[2]);
        }
        let addMatch=content.match(/--add\|([^|]+)\|(.*)$/i);
        if(addMatch){
            saveFormation(playerid, addMatch[1], addMatch[2]);
        }
        showMenu();
        return;
    }

    // ---------------------- --save|... ----------------------
    var saveMatch=content.match(/--save\|(.+)$/i);
    var formationName=null;
    if(saveMatch){
        formationName=saveMatch[1];
        content=content.replace(/--save\|(.+)$/i,'').trim();
    }

    // ---------------------- --summon ----------------------
    let reSummon=/--summon\b/i;
    if(reSummon.test(content)){
        let t=getT();
        var summonData=parseSummonCommand(content);
        if(!summonData || summonData.length===0){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+t.unknownCommand+closeReport;
            sendWhisper(who, txt);
            return;
        }
        if(formationName){
            let fullCommand=content;
            saveFormation(playerid, formationName, fullCommand);
            sendWhisper(who, openReport+formationName+" "+t.formationSaved+closeReport);
        }
        var sel=msg.selected;
        for(let s of summonData){
            let referenceToken = findReferenceToken(sel, s, who, t);
            if(!referenceToken) continue;
            doSummon(s.name, s.args, who, playerid, referenceToken);
        }
        return;
    }

    // Иначе — неизвестная команда
    let t=getT();
    let txt = openReport+openHeader+"Ошибка"+closeHeader+t.unknownCommand+closeReport;
    sendWhisper(who, txt);
});

// ---------------------------------------------------
// ФУНКЦИИ для поиска референс-токена (ids|...)
// ---------------------------------------------------
function findReferenceToken(sel, s, who, t){
    let tokId = s.args.ids || "";
    if(tokId){
        // 1) Пробуем как ID
        let foundObj = getObj("graphic", tokId);
        if(foundObj) {
            return foundObj;
        }
        // 2) Иначе ищем токены по имени (частичное совпадение):
        let pageid = Campaign().get('playerpageid')||Campaign().get('mainpageid');
        let allTokens = findObjs({type:'graphic', pageid: pageid});
        let candidates = allTokens.filter(o =>
            o.get('name').toLowerCase().includes(tokId.toLowerCase())
        );
        if(candidates.length===0){
            sendChat("Summon Script","/w "+who+" "+
                "<div style='border:1px solid #000; background:#ccc; padding:5px;'>"+
                "<b>Ошибка.</b> Не могу найти токен по имени/ID: "+tokId+"</div>"
            );
            return null;
        }
        let rndIndex = randomInteger(candidates.length)-1;
        return candidates[rndIndex];
    }
    else if(sel && sel.length>0){
        let selTok = getObj("graphic", sel[0]._id);
        if(!selTok){
            sendChat("Summon Script","/w "+who+" "+
                "<div style='border:1px solid #000; background:#ccc; padding:5px;'>"+
                "<b>Ошибка.</b> "+ t.needToken +"</div>"
            );
            return null;
        }
        return selTok;
    } else {
        if(!s.args.radius && !s.args.position){
            sendChat("Summon Script","/w "+who+" "+
                "<div style='border:1px solid #000; background:#ccc; padding:5px;'>"+
                "<b>Ошибка.</b> "+ t.needToken +"</div>"
            );
            return null;
        }
        // "виртуальный" токен
        return {
            get:function(prop){
                if(prop==='left')return 0;
                if(prop==='top')return 0;
                if(prop==='width')return state.SUMMON.config.cellSize||70;
                if(prop==='height')return state.SUMMON.config.cellSize||70;
                if(prop==='pageid')return Campaign().get('playerpageid')||Campaign().get('mainpageid');
            }
        };
    }
}

// ---------------------- shuffleArray ----------------------
function shuffleArray(arr){
    for(let i=arr.length-1; i>0; i--){
        let j = randomInteger(i+1)-1; 
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
