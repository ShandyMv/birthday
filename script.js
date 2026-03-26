// ===== MATRIX =====
const matrix = document.getElementById("matrix");
const mtx = matrix.getContext("2d");

matrix.width = innerWidth;
matrix.height = innerHeight;

const letters = "HAPPYBIRTHDAYDEWANI";
const fontSize = 18;
const columns = matrix.width / fontSize;
const drops = Array.from({length: columns}).fill(1);

function drawMatrix(){
  mtx.fillStyle="rgba(0,0,0,0.08)";
  mtx.fillRect(0,0,matrix.width,matrix.height);

  mtx.fillStyle="#ff2e88";
  mtx.font="bold "+fontSize+"px monospace";
  mtx.shadowColor="#ff2e88";
  mtx.shadowBlur=10;

  for(let i=0;i<drops.length;i++){
    let char = letters[Math.floor(Math.random()*letters.length)];
    mtx.fillText(char,i*fontSize,drops[i]*fontSize);

    if(drops[i]*fontSize>matrix.height && Math.random()>0.97){
      drops[i]=0;
    }
    drops[i]++;
  }

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

      if(data[index+3] > 150){
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

  if(seqIndex < sequence.length){
    setTimeout(next,900);
  } else {
    setTimeout(showLove,1200);
  }
}
next();


// ===== HEART =====
const loveCanvas = document.getElementById("loveCanvas");
const lctx = loveCanvas.getContext("2d");

loveCanvas.width = innerWidth;
loveCanvas.height = innerHeight;

function drawHeart(){
  lctx.clearRect(0,0,loveCanvas.width,loveCanvas.height);

  for(let t=0; t<Math.PI*2; t+=0.02){
    let x = 16*Math.pow(Math.sin(t),3);
    let y = 13*Math.cos(t)
      -5*Math.cos(2*t)
      -2*Math.cos(3*t)
      -Math.cos(4*t);

    lctx.fillStyle="#ff2e88";
    lctx.fillRect(innerWidth/2 + x*15, innerHeight/2 - y*15, 4,4);
  }
}

function showLove(){
  dotCanvas.style.display="none";
  drawHeart();
  setTimeout(showFinalPage,1500);
}


// ===== FINAL PAGE =====
function showFinalPage(){
  loveCanvas.style.display="none";
  document.getElementById("finalPage").style.display="flex";
  startAutoSlider();
}


// ===== AUTO SLIDER =====
let index = 0;
const totalSlides = 5;

function startAutoSlider(){
  const slides = document.getElementById("slides");
  const dotsContainer = document.getElementById("dots");

  dotsContainer.innerHTML = "";

  for(let i=0;i<totalSlides;i++){
    let dot = document.createElement("div");
    dot.classList.add("dot");
    if(i===0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }

  function updateSlider(){
    slides.style.transform = `translateX(-${index*100}%)`;

    document.querySelectorAll(".dot").forEach((d,i)=>{
      d.classList.toggle("active", i===index);
    });
  }

  function nextSlide(){
    index++;
    updateSlider();

    if(index < totalSlides){
      setTimeout(nextSlide, 2000);
    } else {
      setTimeout(startPhotoLove, 800);
    }
  }

  setTimeout(nextSlide, 1500);
}


// ===== PHOTO → LOVE (LEBIH BESAR) =====
const photoLove = document.getElementById("photoLove");
const plctx = photoLove.getContext("2d");

photoLove.width = innerWidth;
photoLove.height = innerHeight;

const imgs = [];
["foto1.jpg","foto2.jpg","foto3.jpg","foto4.jpg"].forEach(src=>{
  let img = new Image();
  img.src = src;
  imgs.push(img);
});

function startPhotoLove(){
    document.getElementById("finalPage").style.display="none";
    photoLove.style.display="block";
  
    let particles = [];
  
    const size = 85;
    const density = 0.07;
  
    for(let t=0; t<Math.PI*2; t+=density){
  
      let x = 16*Math.pow(Math.sin(t),3);
      let y = 13*Math.cos(t)
        -5*Math.cos(2*t)
        -2*Math.cos(3*t)
        -Math.cos(4*t);
  
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
  
    let time = 0;
  
    function animate(){
      plctx.clearRect(0,0,photoLove.width,photoLove.height);
  
      time += 0.03;
  
      particles.forEach(p=>{
        // gerakan masuk smooth
        p.x += (p.targetX - p.x)*0.07;
        p.y += (p.targetY - p.y)*0.07;
  
        // fade in
        p.alpha += (1 - p.alpha)*0.05;
  
        // scale up (muncul pelan)
        p.scale += (1 - p.scale)*0.05;
  
        // efek floating halus
        let floatY = Math.sin(time + p.x * 0.01) * 3;
  
        let ratio = p.img.width / p.img.height;
  
        let w = size * p.scale;
        let h = size * p.scale;
  
        if(ratio > 1){
          h = w / ratio;
        } else {
          w = h * ratio;
        }
  
        plctx.globalAlpha = p.alpha;
  
        // glow
        plctx.shadowColor = "#ff2e88";
        plctx.shadowBlur = 20;
  
        plctx.drawImage(
          p.img,
          p.x - w/2,
          p.y - h/2 + floatY,
          w,
          h
        );
      });
  
      plctx.globalAlpha = 1;
      plctx.shadowBlur = 0;
  
      requestAnimationFrame(animate);
    }
  
    animate();
  }