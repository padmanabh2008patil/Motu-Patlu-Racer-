// MOTU-PATLU-RACER — character select, boss-based unlocks, saved progress
const CFG=GAME_CFG,names=Object.keys(CFG.chars);
let selectedCharacter=localStorage.getItem("selectedCharacter")||"Motu";
const norm=n=>/jhatka|zatka/i.test(n)?"Dr. Zatka":n;
function bossInfo(n){const i=CFG.sections.findIndex(s=>s.boss===n);return i<0?null:{sec:CFG.sections[i].name,lvl:(i+1)*15}}
function isUnlocked(n){return n==="Motu"||localStorage.getItem(n+"_unlocked")==="true"||(n==="Dr. Zatka"&&localStorage.getItem("Dr. Jhatka_unlocked")==="true")}
function buildCards(){
 const grid=document.querySelector(".character-card").parentElement;grid.innerHTML="";
 names.forEach(n=>{const u=isUnlocked(n),b=bossInfo(n),c=document.createElement("div");
  c.className="character-card"+(u?"":" locked");c.id=n;c.onclick=()=>selectCharacter(n);
  c.innerHTML='<div class="character-image"></div><h3>'+n+'</h3><p>'+(n==="Motu"?"READY":u?"🔓 UNLOCKED":"🔒 Win Level "+b.lvl+" ("+b.sec+" boss)")+'</p>';
  grid.appendChild(c);mountChar(c.querySelector(".character-image"),n,!u)});
 selectCharacter(isUnlocked(norm(selectedCharacter))?norm(selectedCharacter):"Motu",1)}
function selectCharacter(n,quiet){
 if(!isUnlocked(n)){const b=bossInfo(n);alert("🔒 "+n+" is locked!\nBeat the "+b.sec+" boss (Level "+b.lvl+") to unlock.");return}
 selectedCharacter=n;document.querySelectorAll(".character-card").forEach(c=>c.classList.toggle("selected",c.id===n));
 localStorage.setItem("selectedCharacter",n)}
function startGame(){
 localStorage.setItem("selectedCharacter",selectedCharacter);
 if(!localStorage.getItem("currentLevel"))localStorage.setItem("currentLevel","1");
 location.href="sections.html"}
window.onload=buildCards;
