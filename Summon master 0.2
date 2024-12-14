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

    const content = msg.content.slice("!SM".length).trim();
    const playerid=msg.playerid;
    const player=getObj('player',playerid);
    const who=(player?player.get('displayname'):msg.who)||msg.who;
    const isGM = playerIsGM(playerid);

    // Оформление
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

    // Локализация
    const texts = {
        'ru': {
            helpTitle:"Помощь Summon Script",
            mainCommands:"Основные команды:",
            summonExample:"Призвать существ с параметрами",
            menuCmd:"Меню формаций",
            configCmd:"Настройки (ГМ)",
            helpCmd:"Эта справка",
            summonParams:"Параметры --summon:",
            summonParamsList:"name|\"Имя\", count|число, barX|число(+), showname, radius|число, position|число(0-8), silent, sound|\"НазваниеЗвука\"",
            groupParam:"--group|ИмяФормации: Призвать сохранённую формацию по имени",
            extendedSummon:"Без radius/position – поиск места вокруг токена (gap).",
            savingFormations:"Сохранение формаций:",
            savingExample:"Добавьте --save|Имя к команде --summon. Затем !SM --menu или !SM --group|Имя.",
            unknownCommand:"Неизвестная команда. Используйте --help.",
            damagedFormation:"Формация повреждена, не могу призвать.",
            noFormation:"Нет такой формации.",
            needToken:"Нужен выделенный токен или radius/position.",
            noPlace:"Не удалось найти место.",
            noCreature:"Персонаж не найден",
            summoned:"призвано",
            noSpaceRadius:"Нет места в радиусе.",
            selectTokenOrRadius:"Для summon выберите токен или укажите radius/position.",
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
            changeToEN:"На английский"
        },
        'en': {
            helpTitle:"Summon Script Help",
            mainCommands:"Main Commands:",
            summonExample:"Summon creatures with parameters",
            menuCmd:"Formations menu",
            configCmd:"Settings (GM)",
            helpCmd:"This help",
            summonParams:"--summon parameters:",
            summonParamsList:"name|\"Name\", count|number, barX|number(+), showname, radius|number, position|0-8, silent, sound|\"SoundName\"",
            groupParam:"--group|FormationName: Summon a saved formation by name",
            extendedSummon:"Without radius/position, searches around token (gap).",
            savingFormations:"Saving formations:",
            savingExample:"Add --save|Name to --summon. Then !SM --menu or !SM --group|Name.",
            unknownCommand:"Unknown command. Use --help.",
            damagedFormation:"Formation is damaged, can't summon.",
            noFormation:"No such formation.",
            needToken:"Need a selected token or radius/position.",
            noPlace:"No free space found.",
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
            changeToEN:"Switch to English"
        }
    };

    function getT(){
        return texts[state.SUMMON.config.locale||'ru'];
    }

    const matchLocale=content.match(/--locale\|(ru|en)/i);
    if(matchLocale){
        state.SUMMON.config.locale=matchLocale[1].toLowerCase();
    }

    function showHelpMenu() {
        let t=getT();
        let text = openReport
        + openHeader + t.helpTitle + closeHeader
        + "<b>"+t.mainCommands+"</b><br>"
        + "<code>!SM --summon name|\"Имя\" count|3 ...</code><br>"+t.summonExample+"<br><br>"
        + "<code>!SM --menu</code><br>"+t.menuCmd+"<br><br>"
        + "<code>!SM --config</code><br>"+t.configCmd+"<br><br>"
        + "<code>!SM --help</code><br>"+t.helpCmd+"<br><br>"

        + "<b>"+t.summonParams+"</b><br>"
        + t.summonParamsList+"<br><br>"

        + t.groupParam+"<br><br>"

        + "<b>"+t.extendedSummon+"</b><br><br>"

        + "<b>"+t.savingFormations+"</b><br>"
        + t.savingExample+"<br>"
        + closeReport;

        sendWhisper(who, text);
    }

    function showConfigMenu() {
        let t=getT();
        if(!isGM){
            sendWhisper(who, openReport+openHeader+"Ошибка"+closeHeader+t.onlyGM+closeReport);
            return;
        }

        const matchSilent = content.match(/--silentDefault\|(true|false)/i);
        const matchCell = content.match(/--cellSize\|(\d+)/i);

        if(matchSilent) {
            state.SUMMON.config.silentDefault=(matchSilent[1]==='true');
            sendWhisper(who, openReport+openHeader+"OK"+closeHeader+t.silentCurrent+" "+state.SUMMON.config.silentDefault+closeReport);
            return;
        }

        if(matchCell) {
            let newSize=parseInt(matchCell[1]);
            if(isNaN(newSize)||newSize<1)newSize=70;
            state.SUMMON.config.cellSize=newSize;
            sendWhisper(who, openReport+openHeader+"OK"+closeHeader+t.cellSizeCurrent+" "+state.SUMMON.config.cellSize+closeReport);
            return;
        }

        const localeButtons = btn(t.changeToRU,"!SM --config --locale|ru") + btn(t.changeToEN,"!SM --config --locale|en");
        let text = openReport
        + openHeader + t.configTitle + closeHeader
        + t.localeCurrent+" "+state.SUMMON.config.locale+"<br>"
        + localeButtons+"<br><br>"
        + t.silentCurrent+" "+state.SUMMON.config.silentDefault+"<br>"
        + btn(t.enableSilent,"!SM --config --silentDefault|true")
        + btn(t.disableSilent,"!SM --config --silentDefault|false")
        + "<br><br>"
        + t.cellSizeCurrent+" "+state.SUMMON.config.cellSize+"<br>"
        + btn(t.changeCell,"!SM --config --cellSize|?{New cell size|70}")
        + closeReport;

        sendWhisper(who, text);
    }

    function saveFormation(pid,name,cmd) {
        state.SUMMON.formations[pid]=state.SUMMON.formations[pid]||{};
        state.SUMMON.formations[pid][name]=cmd;
    }

    function deleteFormation(pid,name) {
        if(state.SUMMON.formations[pid] && state.SUMMON.formations[pid][name]){
            delete state.SUMMON.formations[pid][name];
        }
    }

    function editFormation(pid,name,newCmd) {
        if(state.SUMMON.formations[pid] && state.SUMMON.formations[pid][name]){
            state.SUMMON.formations[pid][name]=newCmd;
        }
    }

    function showMenu() {
        let t=getT();
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

        let formations = state.SUMMON.formations[playerid]||{};
        let keys = Object.keys(formations);

        let text = openReport;
        if(keys.length===0) {
            text += openHeader+t.noFormations+closeHeader;
            text += btn("➕ "+t.addFormation,"!SM --menu --add|?{Имя формации}|?{Полная команда с --summon...}");
            text += closeReport;
            sendWhisper(who, text);
            return;
        }

        text+= openHeader+t.savedFormations+closeHeader;
        keys.forEach(fn=>{
            let cmd = formations[fn];
            text+=fn+": "
              + btn(t.summonLabel,"!SM --group|"+fn)
              + btn(t.deleteLabel,"!SM --menu --delete|"+fn)
              + btn(t.editLabel,"!SM --menu --edit|"+fn+"|?{Новая команда для "+fn+"}")
              + "<br>";
        });
        text+="<br>"+btn("➕ "+t.addFormation,"!SM --menu --add|?{Имя формации}|?{Полная команда с --summon...}");
        text+= closeReport;
        sendWhisper(who, text);
    }

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

    function tokenize(str) {
        var regex = /"[^"]*"|'[^']*'|\S+/g;
        var matches=[];
        var m;
        while(m=regex.exec(str)){
            matches.push(m[0]);
        }
        return matches;
    }

    function parseSummonCommand(input) {
        var reSummon = /--summon\b/i;
        if(!reSummon.test(input)) return null;

        var parts = input.split(reSummon);
        var block = (parts[1]||'').trim();
        if(!block)return null;

        var tokens = tokenize(block);
        var nameIndex = tokens.findIndex(t=>t.toLowerCase().startsWith('name|'));
        if(nameIndex===-1)return null;
        var nameVal = tokens[nameIndex].split('|')[1]||'';
        tokens.splice(nameIndex,1);

        var args={};
        tokens.forEach(t=>{
            var kv=t.split('|');
            if(kv.length===2){
                var k=kv[0].toLowerCase();
                var v=kv[1];
                v=processDiceExpressions(v);
                args[k]=v;
            } else {
                var f=t.toLowerCase();
                args[f]=true;
            }
        });
        return {name:nameVal,args:args};
    }

    function doSummon(name,args,who,pid,referenceToken){
        let t=getT();
        var pageid=referenceToken.get('pageid');
        var gridIncrement=(state.SUMMON.config.cellSize||70);

        function sendError(msg){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+msg+closeReport;
            sendWhisper(who, txt);
        }

        function boxesOverlap(ax,ay,aw,ah,bx,by,bw,bh){
            return !(bx>=ax+aw||bx+bw<=ax||by>=ay+ah||by+bh<=ay);
        }
        function gapBetweenRanges(startA,lengthA,startB,lengthB){
            var endA=startA+lengthA;
            var endB=startB+lengthB;
            if(endA<startB)return startB-endA;
            if(endB<startA)return startA-endB;
            return 0;
        }
        function isAdjacent(ax,ay,aw,ah,bx,by,bw,bh,gap){
            if(boxesOverlap(ax,ay,aw,ah,bx,by,bw,bh))return false;
            var horizontalGap=gapBetweenRanges(ax,aw,bx,bw);
            var verticalGap=gapBetweenRanges(ay,ah,by,bh);
            return (horizontalGap<=gap&&verticalGap<=gap);
        }
        function isAreaFree(pageid,x,y,w,h,excludeTokens){
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
        function generateFrontier(sources,sumSizeX,sumSizeY,pageid,placedTokens,gap){
            var candidates=[];
            var visited={};
            function addCandidate(cx,cy){
                var key=cx+"_"+cy;
                if(!visited[key]){
                    visited[key]=true;
                    candidates.push({x:cx,y:cy});
                }
            }

            var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
            for(var s of sources){
                if(s.x<minX)minX=s.x;
                if(s.y<minY)minY=s.y;
                if(s.x+s.w>maxX)maxX=s.x+s.w;
                if(s.y+s.h>maxY)maxY=s.y+s.h;
            }

            for(var cx=minX-gap - sumSizeX;cx<=maxX+gap;cx++){
                for(var cy=minY-gap - sumSizeY;cy<=maxY+gap;cy++){
                    for(var src of sources){
                        if(isAdjacent(src.x,src.y,src.w,src.h,cx,cy,sumSizeX,sumSizeY,gap)){
                            if(isAreaFree(pageid,cx,cy,sumSizeX,sumSizeY,[])){
                                addCandidate(cx,cy);
                                break;
                            }
                        }
                    }
                }
            }

            return candidates;
        }

        function generateRadiusCandidates(refGridX,refGridY,sumSizeX,sumSizeY,pageid,placedTokens,radiusFeet){
            var radiusCells=Math.floor(radiusFeet/5);
            var candidates=[];
            var visited={};
            function addCandidate(cx,cy){
                var key=cx+"_"+cy;
                if(!visited[key]){
                    visited[key]=true;
                    candidates.push({x:cx,y:cy});
                }
            }
            for(var cx=refGridX - radiusCells;cx<=refGridX+radiusCells;cx++){
                for(var cy=refGridY - radiusCells;cy<=refGridY+radiusCells;cy++){
                    var dx=cx-refGridX;
                    var dy=cy-refGridY;
                    if(dx*dx+dy*dy<=radiusCells*radiusCells){
                        if(isAreaFree(pageid,cx,cy,sumSizeX,sumSizeY,[])){
                            addCandidate(cx,cy);
                        }
                    }
                }
            }
            return candidates;
        }

        function applyTokenArgs(tokenProps, args) {
            if(args.showname) {
                tokenProps.showname = true;
                tokenProps.showplayers_name = true;
            }
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
        }

        function placeOneToken(character,args,x,y,sumSizeX,sumSizeY){
            character.get('defaulttoken',function(dt){
                var summonedTokenWidth=sumSizeX*(state.SUMMON.config.cellSize||70);
                var summonedTokenHeight=sumSizeY*(state.SUMMON.config.cellSize||70);
                var tokenProps;
                try {
                    if(dt) {
                        var d=JSON.parse(dt);
                        if(Array.isArray(d))d=d[0];
                        tokenProps=_.clone(d);
                    } else {
                        tokenProps={imgsrc:"https://s3.amazonaws.com/files.d20.io/images/65655/Roll20_Unknown.png?thumb=1"};
                    }
                } catch(e){
                    tokenProps={imgsrc:"https://s3.amazonaws.com/files.d20.io/images/65655/Roll20_Unknown.png?thumb=1"};
                }

                delete tokenProps._id;
                delete tokenProps._type;
                tokenProps.left=x*(state.SUMMON.config.cellSize||70)+summonedTokenWidth/2;
                tokenProps.top=y*(state.SUMMON.config.cellSize||70)+summonedTokenHeight/2;
                tokenProps.pageid=pageid;
                tokenProps.layer='objects';
                tokenProps.width=summonedTokenWidth;
                tokenProps.height=summonedTokenHeight;
                tokenProps.name=tokenProps.name||character.get('name');
                tokenProps.represents=character.id;
                applyTokenArgs(tokenProps,args);
                createObj('graphic',tokenProps);
            });
        }

        var count = parseInt(args.count||"1");
        if(isNaN(count)||count<1)count=1;
        if(count>20)count=20;
        var silent=args.hasOwnProperty('silent')||state.SUMMON.config.silentDefault;
        var character=findObjs({type:'character'}).find(c=>c.get('name').toLowerCase()===name.toLowerCase());
        if(!character){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+t.noCreature+" "+name+closeReport;
            sendWhisper(who, txt);
            return;
        }

        var refTokenWidth = referenceToken.get('width')||state.SUMMON.config.cellSize||70;
        var refTokenHeight= referenceToken.get('height')||state.SUMMON.config.cellSize||70;
        var refLeft=(referenceToken.get('left')||0)-refTokenWidth/2;
        var refTop=(referenceToken.get('top')||0)-refTokenHeight/2;

        var refGridX=Math.round(refLeft/(state.SUMMON.config.cellSize||70));
        var refGridY=Math.round(refTop/(state.SUMMON.config.cellSize||70));
        var refSizeX=refTokenWidth/(state.SUMMON.config.cellSize||70);
        var refSizeY=refTokenHeight/(state.SUMMON.config.cellSize||70);

        var sizeMap={'F':0.5,'D':0.5,'T':0.5,'S':0.5,'M':1,'L':2,'H':3,'G':4,'C':6};
        var sizeParam=args.size||'M';
        sizeParam=processDiceExpressions(sizeParam);
        if(/^\d+$/.test(sizeParam)){
            var sn=parseInt(sizeParam);
            var sc=['F','D','T','S','M','L','H','G','C'];
            sizeParam=sc[sn%sc.length];
        } else {
            sizeParam=sizeParam.toUpperCase();
        }

        var sumSizeX=sumSizeY=1;
        if(sizeMap[sizeParam]) {
            sumSizeX=sizeMap[sizeParam];
            sumSizeY=sizeMap[sizeParam];
        }

        var positionParam=args.position?parseInt(args.position):null;
        if(isNaN(positionParam)) positionParam=null;
        var radiusParam=args.radius?parseInt(args.radius):null;
        if(isNaN(radiusParam))radiusParam=null;

        var placedTokens=[];

        function finalSummon(coords) {
            for(var i=0;i<count;i++){
                var c=coords[i%coords.length];
                placeOneToken(character,args,c.x,c.y,sumSizeX,sumSizeY);
            }
            if(!silent) sendChat("Summon Script", character.get('name')+" "+t.summoned+" "+count+"!");
            if(args.sound && !silent) {
                sendChat("", "/em 🎵 "+t.playingSound+" "+args.sound);
            }
        }

        if(radiusParam){
            var candidates=generateRadiusCandidates(refGridX,refGridY,sumSizeX,sumSizeY,pageid,placedTokens,radiusParam);
            if(candidates.length===0){
                let txt = openReport+openHeader+"Ошибка"+closeHeader+t.noSpaceRadius+closeReport;
                sendWhisper(who, txt);
                return;
            }
            var coords=[];
            for(var i=0;i<count;i++){
                var r=Math.floor(Math.random()*candidates.length);
                coords.push(candidates[r]);
            }
            finalSummon(coords);
        } else if(positionParam!==null){
            var offsets={
                0:{dx:0,dy:0},
                1:{dx:0,dy:-sumSizeY},
                2:{dx:sumSizeX,dy:-sumSizeY},
                3:{dx:sumSizeX,dy:0},
                4:{dx:sumSizeX,dy:sumSizeY},
                5:{dx:0,dy:sumSizeY},
                6:{dx:-sumSizeX,dy:sumSizeY},
                7:{dx:-sumSizeX,dy:0},
                8:{dx:-sumSizeX,dy:-sumSizeY}
            };
            var off=offsets[positionParam]||{dx:0,dy:0};
            var coords=[];
            for(var i=0;i<count;i++){
                coords.push({x:refGridX+off.dx+i,y:refGridY+off.dy});
            }
            finalSummon(coords);
        } else {
            var initialSource=[{x:refGridX,y:refGridY,w:refSizeX,h:refSizeY}];
            var maxGap=20;
            var gapFound=false;
            var finalCandidates=[];

            for(var g=0;g<=maxGap;g++){
                var frontier=generateFrontier(initialSource,sumSizeX,sumSizeY,pageid,placedTokens,g);
                if(frontier.length>0){
                    finalCandidates=frontier;
                    gapFound=true;
                    break;
                }
            }

            if(!gapFound||finalCandidates.length===0){
                let txt = openReport+openHeader+"Ошибка"+closeHeader+t.noPlace+closeReport;
                sendWhisper(who, txt);
                return;
            }

            var coords=[];
            for(var i=0;i<count;i++){
                coords.push(finalCandidates[i%finalCandidates.length]);
            }
            finalSummon(coords);
        }
    }

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
        if(!summonData){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+t.damagedFormation+closeReport;
            sendWhisper(who, txt);
            return;
        }

        var sel=msg.selected;
        if((!sel||sel.length===0) && !summonData.args.radius && !summonData.args.position){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+t.needToken+closeReport;
            sendWhisper(who, txt);
            return;
        }

        var referenceToken;
        if(sel&&sel.length>0){
            referenceToken=getObj("graphic", sel[0]._id);
            if(!referenceToken){
                let txt = openReport+openHeader+"Ошибка"+closeHeader+t.needToken+closeReport;
                sendWhisper(who, txt);
                return;
            }
        } else {
            referenceToken={
                get:function(prop){
                    if(prop==='left')return 0;
                    if(prop==='top')return 0;
                    if(prop==='width')return state.SUMMON.config.cellSize||70;
                    if(prop==='height')return state.SUMMON.config.cellSize||70;
                    if(prop==='pageid')return Campaign().get('playerpageid')||Campaign().get('mainpageid');
                }
            };
        }

        doSummon(summonData.name,summonData.args,who,playerid,referenceToken);
        return;
    }

    if(content.startsWith("--help")){
        showHelpMenu();
        return;
    }

    if(content.startsWith("--config")){
        showConfigMenu();
        return;
    }

    if(content.startsWith("--menu")){
        showMenu();
        return;
    }

    var saveMatch=content.match(/--save\|(.+)$/i);
    var formationName=null;
    if(saveMatch){
        formationName=saveMatch[1];
        content=content.replace(/--save\|(.+)$/i,'').trim();
    }

    var reSummon=/--summon\b/i;
    if(reSummon.test(content)){
        let t=getT();
        var summonData=parseSummonCommand(content);
        if(!summonData){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+t.unknownCommand+closeReport;
            sendWhisper(who, txt);
            return;
        }

        if(formationName){
            var fullCommand=content; 
            saveFormation(playerid, formationName, fullCommand);
            sendWhisper(who, openReport+formationName+" "+t.formationSaved+closeReport);
        }

        var sel=msg.selected;
        if((!sel||sel.length===0) && !summonData.args.radius && !summonData.args.position){
            let txt = openReport+openHeader+"Ошибка"+closeHeader+t.selectTokenOrRadius+closeReport;
            sendWhisper(who, txt);
            return;
        }

        var referenceToken;
        if(sel&&sel.length>0){
            referenceToken=getObj("graphic", sel[0]._id);
            if(!referenceToken){
                let txt = openReport+openHeader+"Ошибка"+closeHeader+t.needToken+closeReport;
                sendWhisper(who, txt);
                return;
            }
        } else {
            referenceToken={
                get:function(prop){
                    if(prop==='left')return 0;
                    if(prop==='top')return 0;
                    if(prop==='width')return state.SUMMON.config.cellSize||70;
                    if(prop==='height')return state.SUMMON.config.cellSize||70;
                    if(prop==='pageid')return Campaign().get('playerpageid')||Campaign().get('mainpageid');
                }
            };
        }

        doSummon(summonData.name,summonData.args,who,playerid,referenceToken);
        return;
    }

    let t=getT();
    let txt = openReport+openHeader+"Ошибка"+closeHeader+t.unknownCommand+closeReport;
    sendWhisper(who, txt);
});
