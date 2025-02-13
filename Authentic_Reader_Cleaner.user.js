// ==UserScript==
// @name        Authentic Reader Cleaner
// @namespace        http://blog.ameba.jp
// @version        0.4
// @description        Authentic Reader の履歴データから退会者を排除する
// @author        Ameba Blog User
// @match        https://ameblo.jp/*
// @exclude        https://ameblo.jp/personwritep/entry-12872560547.html
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @noframes
// @grant        none
// @updateURL        https://github.com/personwritep/Authentic_Reader_Cleaner/raw/main/Authentic_Reader_Cleaner.user.js
// @downloadURL        https://github.com/personwritep/Authentic_Reader_Cleaner/raw/main/Authentic_Reader_Cleaner.user.js
// ==/UserScript==


let readers=[]; // フォロワー登録データ
let UserID; // アメーバログインID



setTimeout(()=>{
    id_check();
}, 1000 );


function id_check(){
    let amebaId=document.querySelector('._w6MHwCAy');
    if(amebaId){
        UserID=amebaId.textContent; }

    if(!UserID){
        alert(
            '⛔　======== Authentic Reader Cleaner ========\n'+
            '　　ユーザーIDが取得出来ないため処理を実行できません\n'+
            '　　ページのリロードを試し、さらにアメーバのログインに問題\n'+
            '　　が無いかを確認してください'); }
    else{
        main(); }

} // id_check()



function write_session(){
    let write_json=JSON.stringify(readers);
    sessionStorage.setItem('AR_'+UserID, write_json); } // セッションストレージ 保存名



function main(){
    let read_json=sessionStorage.getItem('AR_'+UserID); // セッションストレージ 保存名
    readers=JSON.parse(read_json);
    if(readers==null){
        readers=[['name', '1990年time', '0']];
        write_session(); }

    disp_panel();
    file_act();
    unsubscribe();
    close();

} // main()



function disp_panel(){

    let help_url='https://ameblo.jp/personwritep/entry-12872560547.html';

    let SVG_h=
        '<svg class="help_ARC" height="22" width="22"  viewBox="0 0 200 200">'+
        '<path d="M89 22C71 25 54 33 41 46C7 81 11 142 50 171C58 177 68 182 78 18'+
        '5C90 188 103 189 115 187C126 185 137 181 146 175C155 169 163 162 169 153'+
        'C190 123 189 80 166 52C147 30 118 18 89 22z" style="fill:#888;"></path>'+
        '<path d="M67 77C73 75 78 72 84 70C94 66 114 67 109 83C106 91 98 95 93 10'+
        '1C86 109 83 116 83 126L111 126C112 114 122 108 129 100C137 90 141 76 135'+
        ' 64C127 45 101 45 84 48C80 49 71 50 68 54C67 56 67 59 67 61L67 77M85 143'+
        'L85 166L110 166L110 143L85 143z" style="fill:#fff;"></path>'+
        '</svg>';


    let panel=
        '<div id="modal_ARC">'+
        '<div id="panel_ARC">'+
        '<div class="ARC1">'+
        '<a href="'+ help_url +'" target="_blank" rel="noopener noreferrer">'+
        SVG_h +'</a>'+
        '<input class="import swe" type="submit" value="Import">'+
        '<input class="file_input" type="file">'+
        '<span class="data_disp">　</span>'+
        '<input class="check swe" type="submit" value="Check">'+
        '<input class="export swe" type="submit" value="Clean Export">'+
        '<input class="close swc" type="submit" value="✖">'+
        '</div>'+
        '<div class="ARC2">'+
        '<ul></ul>'+
        '</div></div>'+

        '<style>'+
        'html { overflow: hidden; } '+
        '#modal_ARC { '+
        'position: fixed; top: 0; left: 0; z-index: 6000; width: 100%; height: 100%; } '+
        '#panel_ARC { position: absolute; top: 100px; left: calc(50% - 350px); '+
        'display: flex; flex-direction: column; width: 680px; padding: 12px 15px 12px; '+
        'font: normal 16px/16px Meiryo; color: #666; background: #e0f0fd; '+
        'border: 1px solid #ccc; border-radius: 2px; box-shadow: 0 0 0 100vw #00000080; } '+
        '.swe { padding: 1px 6px 0; height: 28px; cursor: pointer; } '+
        '.swc { padding: 1px 4px 0; height: 28px; margin-right: -10px } '+
        '#panel_ARC .help_ARC { margin: 0 6px -5px 0; } '+
        '#panel_ARC .import { margin-right: 10px; } '+
        '#panel_ARC .file_input { display: none; } '+
        '#panel_ARC .data_disp { display: inline-block; width: 320px; height: 28px; '+
        'padding: 6px 6px 0; margin-right: 10px; box-sizing: border-box; vertical-align: -8px; '+
        'font: normal 16px/16px Meiryo; border: 1px solid #ccc; color: #000; background: #fff; '+
        'overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis; } '+
        '#panel_ARC .check { margin-right: 20px; } '+
        '#panel_ARC .export { margin-right: 20px; } '+

        '#panel_ARC .ARC2 { margin: 12px 0; height: calc(100vh - 300px); overflow-y: scroll; '+
        'font: normal 16px Meiryo; color: #000; background: #fff; } '+
        '#panel_ARC .ARC2 li { padding: 5px 12px 3px; border-bottom: 1px solid #ccc; } '+
        '#panel_ARC .dn { display: inline-block; width: 30px; font-size: 12px; text-align: left; } '+
        '#panel_ARC .d0 { display: inline-block; width: 300px; } '+
        '#panel_ARC .d1 { display: inline-block; width: 150px; } '+
        '#panel_ARC .d2 { display: inline-block; width: 150px; } '+
        '</style>'+
        '</div>';

    if(!document.querySelector('#panel_ARC')){
        document.body.insertAdjacentHTML('beforeend', panel); }

} // disp_panel()



function file_act(){
    let imp=document.querySelector('#panel_ARC .import');
    let file_input=document.querySelector('#panel_ARC .file_input');
    let exp=document.querySelector('#panel_ARC .export');

    if(imp && file_input){
        imp.onclick=function(event){
            file_input.click(); }

        file_input.addEventListener('change' , function(){
            if(!(file_input.value)) return; // ファイルが選択されない場合
            let file_list=file_input.files;
            if(!file_list) return; // ファイルリストが選択されない場合
            let file=file_list[0];
            if(!file) return; // ファイルが無い場合

            if(file.name.startsWith('auth_reader_'+ UserID)){ // ファイル名の確認
                let file_reader=new FileReader();
                file_reader.readAsText(file);
                file_reader.onload=function(){

                    let data_in=JSON.parse(file_reader.result);
                    readers=data_in;
                    setTimeout(()=>{
                        let data_disp=document.querySelector('#panel_ARC .data_disp');
                        if(data_disp){
                            data_disp.textContent=file.name;
                            write_session(); } // セッションストレージに保存
                    }, 200);

                    setTimeout(()=>{
                        disp_list();
                    }, 200);
                }
            }
            else{
                alert(
                    "❌　Authentic Reader の Exportファイルではありません\n"+
                    "　　 Importファイルは「auth_reader ... 」の名前です"); }


            setTimeout(()=>{
                this.value=null; // 同ファイルの再読込みを可能にする
            }, 1000);
        });

    } // if(imp && file_input)



    if(exp){
        exp.onclick=function(){
            if(check_li()){
                let write_json=JSON.stringify(readers); //「フォロワー履歴」を書出す
                let blob=new Blob([write_json], {type: 'application/json'});

                let a_elem=document.createElement('a');
                a_elem.href=URL.createObjectURL(blob);
                a_elem.download='auth_reader_'+ UserID +'_cl.json'; // 保存ファイル名「_cl」が付く
                a_elem.click();
                URL.revokeObjectURL(a_elem.href);
            }}

    } // if(exp)

} // file_act()



function disp_list(){
    let ul=document.querySelector('#panel_ARC .ARC2 ul');
    let li='';
    if(ul){
        for(let k=0; k<readers.length; k++){
            li+=
                '<li>'+
                '<span class="dn">'+ k +'</span>'+
                '<span class="d0">'+ readers[k][0] +'</span>'+
                '<span class="d1">'+ readers[k][1] +'</span>';
            if(!readers[k][3]){
                li+='<span class="d2">　</span>'; }
            else{
                li+='<span class="d2">'+ readers[k][3] +'</span>'; }
            li+='</li>';
        }

        if(ul.querySelectorAll('li')){
            ul.innerHTML=''; }
        ul.insertAdjacentHTML('beforeend', li );

    }
} // disp_list()



function check_li(){
    let li=document.querySelectorAll('#panel_ARC li');
    if(li.length>0){
        return true; }}



function unsubscribe(){
    let check=document.querySelector('#panel_ARC .check');
    if(check){
        check.onclick=function(){
            if(check_li()){
                let panel_li=document.querySelectorAll('#panel_ARC li');

                for(let i=0; i<panel_li.length; i++){
                    let id=panel_li[i].querySelector('.d0').textContent;

                    if(check_id(id)){
                        panel_li[i].style.background='#2196f395';
                        for(let k=0; k<readers.length; k++){
                            if(id==readers[k][0]){
                                readers[k][2]='3'; // 退会者のフラグ
                                break; }}}}

                write_session(); }} // 退会者のフラグのストレージ保存

    } // if(check)


    function check_id(id){
        let url='https://ameblo.jp/'+ id;
        if(load(url)!=200){
            return true; } // target_urlが無い時に true

        function load(_url){
            let xhr;
            xhr=new XMLHttpRequest();
            xhr.open("HEAD", _url, false); // 同期モード
            xhr.send();
            return xhr.status; }}

} // unsubscribe()



function close(){
    let close=document.querySelector('#panel_ARC .close');
    if(close){
        close.onclick=function(){
            let panel=document.querySelector('#modal_ARC');
            if(panel){
                panel.remove(); }}}

} // close()
