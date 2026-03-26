// ===== MATRIX =====
const matrix = document.getElementById("matrix");
const mtx = matrix.getContext("2d");

matrix.width = innerWidth;
matrix.height = innerHeight;

const letters = "HAPPYBIRTHDAYDEWANI";
const fontSize = 28; // lebih gede
const totalLetters = 120;

let particlesMatrix = [];
for(let i=0;i<totalLetters;i++){
  particlesMatrix.push({
    x: Math.random() * matrix.width,
    y: Math.random() * matrix.height,
    charIndex: Math.floor(Math.random() * letters.length)
  });
}

function drawMatrix(){
  mtx.fillStyle="rgba(0,0,0,0.08)";
  mtx.fillRect(0,0,matrix.width,matrix.height);

  mtx.fillStyle="#ff2e88";
  mtx.font="bold "+fontSize+"px monospace";
  mtx.shadowColor="#ff2e88";
  mtx.shadowBlur=10;

  particlesMatrix.forEach(p=>{
    let char = letters[p.charIndex];
    mtx.fillText(char, p.x, p.y);

    p.y += fontSize*0.5; // kecepatan turun

    if(p.y > matrix.height){
      p.y = -fontSize;
      p.x = Math.random() * matrix.width; // x random lagi
      p.charIndex = Math.floor(Math.random() * letters.length);
    }
  });

  mtx.shadowBlur=0;
}
setInterval(drawMatrix,30);

// ===== DOT COUNTDOWN =====
const dotCanvas = document.getElementById("dotCanvas");
const ctx = dotCanvas.getContext("2d");
dotCanvas.width = innerWidth;
dotCanvas.height = innerHeight;

function drawDotText(text){
  ctx.clearRect(0,0,dotCanvas.width,dotCanvas.height);

  const temp = document.createElement("canvas");
  const tctx = temp.getContext("2d");

  temp.width = dotCanvas.width;
  temp.height = dotCanvas.height;

  tctx.fillStyle="#fff";
  tctx.font="bold 140px Orbitron";
  tctx.textAlign="center";
  tctx.fillText(text, temp.width/2, temp.height/2);

  const data = tctx.getImageData(0,0,temp.width,temp.height).data;
  const gap = 8;

  for(let y=0;y<temp.height;y+=gap){
    for(let x=0;x<temp.width;x+=gap){
      const index = (y*temp.width + x)*4;
      if(data[index+3]>150){
        ctx.fillStyle="#ff2e88";
        ctx.shadowColor="#ff2e88";
        ctx.shadowBlur=15;
        ctx.beginPath();
        ctx.arc(x,y,3,0,Math.PI*2);
        ctx.fill();
      }
    }
  }
  ctx.shadowBlur=0;
}

const sequence = ["3","2","1","HAPPY","BIRTHDAY","TO","DEWANI 💖"];
let seqIndex = 0;

function next(){
  drawDotText(sequence[seqIndex]);
  seqIndex++;
  if(seqIndex<sequence.length) setTimeout(next,900);
  else setTimeout(showLove,1200);
}
next();

// ===== HEART =====
const loveCanvas = document.getElementById("loveCanvas");
const lctx = loveCanvas.getContext("2d");
loveCanvas.width = innerWidth;
loveCanvas.height = innerHeight;

let heartParticles = [];

function createHeartParticles(){
  heartParticles = [];
  const density = 0.02;
  const size = 12;
  const scale = Math.min(innerWidth, innerHeight)/40;

  for(let t=0;t<Math.PI*2;t+=density){
    let x = 16*Math.pow(Math.sin(t),3);
    let y = 13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);

    for(let i=0;i<3;i++){
      heartParticles.push({
        x: Math.random()*innerWidth,
        y: Math.random()*innerHeight,
        targetX: innerWidth/2 + x*scale + (Math.random()-0.5)*8,
        targetY: innerHeight/2 - y*scale + (Math.random()-0.5)*8,
        size: size,
        alpha: 0,
        floatOffset: Math.random()*Math.PI*2
      });
    }
  }
}

function animateHeart(){
  lctx.clearRect(0,0,loveCanvas.width,loveCanvas.height);
  heartParticles.forEach(p=>{
    p.x += (p.targetX - p.x)*0.08;
    p.y += (p.targetY - p.y)*0.08;
    p.alpha += (1 - p.alpha)*0.05;

    let floatY = Math.sin(Date.now()*0.002 + p.floatOffset)*4;

    lctx.globalAlpha = p.alpha;
    lctx.shadowColor="#ff2e88";
    lctx.shadowBlur=15;
    lctx.fillStyle="#ff2e88";
    lctx.fillRect(p.x-p.size/2,p.y-p.size/2+floatY,p.size,p.size);
  });

  lctx.globalAlpha=1;
  lctx.shadowBlur=0;
  requestAnimationFrame(animateHeart);
}

function showLove(){
  dotCanvas.style.display="none";
  createHeartParticles();
  animateHeart();
  setTimeout(showFinalPage,2000);
}

// ===== FINAL PAGE =====
function showFinalPage(){
  loveCanvas.style.display="none";
  document.getElementById("finalPage").style.display="flex";
  startAutoSlider();
}

// ===== AUTO SLIDER =====
let index=0;
const totalSlides=5;

function startAutoSlider(){
  const slides=document.getElementById("slides");
  const dotsContainer=document.getElementById("dots");
  dotsContainer.innerHTML="";

  for(let i=0;i<totalSlides;i++){
    let dot=document.createElement("div");
    dot.classList.add("dot");
    if(i===0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }

  function updateSlider(){
    slides.style.transform=`translateX(-${index*100}%)`;
    document.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active",i===index));
  }

  function nextSlide(){
    index++;
    updateSlider();
    if(index<totalSlides) setTimeout(nextSlide,2000);
    else setTimeout(startPhotoLove,800);
  }

  setTimeout(nextSlide,1500);
}

// ===== PHOTO → LOVE =====
const photoLove=document.getElementById("photoLove");
const plctx=photoLove.getContext("2d");
photoLove.width=innerWidth;
photoLove.height=innerHeight;

const imgs=[];
["foto1.jpg","foto2.jpg","foto3.jpg","foto4.jpg"].forEach(src=>{
  let img=new Image();
  img.src=src;
  imgs.push(img);
});

function startPhotoLove(){
  document.getElementById("finalPage").style.display="none";
  photoLove.style.display="block";

  let particles=[];

  const size=85;
  const density=0.07;

  for(let t=0;t<Math.PI*2;t+=density){
    let x = 16*Math.pow(Math.sin(t),3);
    let y = 13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    particles.push({
      x: Math.random()*innerWidth,
      y: Math.random()*innerHeight,
      targetX: innerWidth/2 + x*22,
      targetY: innerHeight/2 - y*22,
      img: imgs[Math.floor(Math.random()*imgs.length)],
      scale: 0,
      alpha: 0
    });
  }

  let time=0;

  function animatePhotoLove(){
    plctx.clearRect(0,0,photoLove.width,photoLove.height);
    time+=0.03;

    particles.forEach(p=>{
      p.x += (p.targetX - p.x)*0.07;
      p.y += (p.targetY - p.y)*0.07;
      p.alpha += (1 - p.alpha)*0.05;
      p.scale += (1 - p.scale)*0.05;

      let floatY=Math.sin(time + p.x*0.01)*3;

      let ratio=p.img.width/p.img.height;
      let w=size*p.scale;
      let h=size*p.scale;
      if(ratio>1) h=w/ratio; else w=h*ratio;

      plctx.globalAlpha=p.alpha;
      plctx.shadowColor="#ff2e88";
      plctx.shadowBlur=20;
      plctx.drawImage(p.img,p.x-w/2,p.y-h/2+floatY,w,h);
    });

    plctx.globalAlpha=1;
    plctx.shadowBlur=0;
    requestAnimationFrame(animatePhotoLove);
  }

  animatePhotoLove();

  // swap gambar tiap 2 detik
  setInterval(()=>{
    particles.forEach(p=>{
      p.img=imgs[Math.floor(Math.random()*imgs.length)];
    });
  },2000);
}