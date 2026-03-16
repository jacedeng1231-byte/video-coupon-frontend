<template>
  <div class="retro-tv-container">
    <div class="tv-antenna">
      <div class="antenna-rod left"></div>
      <div class="antenna-rod right"></div>
      <div class="antenna-base"></div>
    </div>
    
    <div class="tv-body">
      <div class="tv-inner-body">
        
        <!-- CRT Screen Area -->
        <div class="crt-wrapper">
          <div class="crt-bezel">
            <div class="crt-screen">
              
              <!-- Video content -->
              <div class="player-container">
                <div :id="'player-' + video._id" class="player"></div>
              </div>
              
              <!-- CRT Effects Overlay (pointer-events: none) -->
              <div class="crt-effects">
                <div class="scanlines"></div>
                <div class="noise"></div>
                <div class="vignette"></div>
                <div class="glass-reflection"></div>
              </div>
              
              <!-- On-Screen Display (OSD) -->
              <div class="osd-text title">{{ video.title }}</div>
              
              <div class="osd-text status blink" v-if="video.isClaimed">CH 3 - CLAIMED</div>
              <div class="osd-text status" v-else-if="watched">CH 3 - WATCHED</div>
              <div class="osd-text status" v-else>CH 3 - AV 1</div>
            </div>
          </div>
        </div>

        <!-- TV Controls Panel -->
        <div class="tv-panel">
          
          <div class="knobs-container">
            <div class="knob">
              <div class="knob-dial"></div>
              <div class="knob-marker"></div>
            </div>
            <div class="knob">
              <div class="knob-dial"></div>
              <div class="knob-marker"></div>
            </div>
          </div>

          <div class="speaker-grille">
            <div class="grille-row" v-for="r in 8" :key="'r-'+r">
              <div class="grille-hole" v-for="c in 4" :key="'c-'+c"></div>
            </div>
          </div>

          <div class="action-buttons">
            <button
              v-if="watched && !video.isClaimed"
              class="vintage-btn claim-btn"
              @click="$emit('claim')"
              title="Claim Reward"
            >
              <span class="btn-icon">🎁</span>
            </button>

            <button
              class="vintage-btn watch-btn"
              @click="$emit('simulateWatch')"
              title="Simulate Watch (Dev)"
            >
              <span class="btn-icon">▶</span>
            </button>
          </div>
          
          <div class="brand">RETROVISION</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    video: Object,
    watched: Boolean
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.retro-tv-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem auto;
  width: 100%;
  max-width: 550px; /* Slightly wider to fit side panel */
  filter: drop-shadow(0 25px 35px rgba(0,0,0,0.6));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.retro-tv-container:hover {
  transform: translateY(-8px) scale(1.02);
}

/* --- Antenna --- */
.tv-antenna {
  position: relative;
  width: 120px;
  height: 60px;
  margin-bottom: -15px;
  z-index: -1;
}

.antenna-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 20px;
  background: linear-gradient(to bottom, #d4cfc7, #888);
  border-radius: 20px 20px 0 0;
  border: 2px solid #555;
  border-bottom: none;
}

.antenna-rod {
  position: absolute;
  bottom: 10px;
  width: 6px;
  height: 80px;
  background: linear-gradient(to right, #ccc, #fff, #999);
  border-radius: 3px;
  border: 1px solid #777;
}

.antenna-rod.left {
  left: 30px;
  transform: rotate(-35deg);
  transform-origin: bottom center;
}

.antenna-rod.right {
  right: 30px;
  transform: rotate(35deg);
  transform-origin: bottom center;
}

/* --- TV Body --- */
.tv-body {
  width: 100%;
  /* Wood texture approximation using gradients */
  background: linear-gradient(135deg, #7c4c26 0%, #5c3412 50%, #4a280e 100%);
  border-radius: 30px;
  padding: 20px;
  box-shadow: 
    inset 0 10px 20px rgba(255,255,255,0.15),
    inset 0 -10px 25px rgba(0,0,0,0.7),
    0 15px 25px rgba(0,0,0,0.6);
  border: 4px solid #331908;
}

.tv-inner-body {
  background: #1a1a1a;
  border-radius: 20px;
  display: flex;
  padding: 20px;
  gap: 20px;
  box-shadow: inset 0 0 30px rgba(0,0,0,1);
  border: 2px solid #000;
  border-top-color: #333;
}

/* --- CRT Screen --- */
.crt-wrapper {
  flex: 1;
  background: #0d0d0d;
  border-radius: 12%;
  padding: 12px;
  box-shadow: 
    0 0 0 10px #222, 
    0 0 0 14px #151515,
    inset 0 10px 15px rgba(0,0,0,0.8);
}

.crt-bezel {
  width: 100%;
  aspect-ratio: 4 / 3; /* Classic TV ratio */
  background: #050505;
  border-radius: 10%;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 40px #000;
  border: 2px solid #2a2a2a;
}

.crt-screen {
  position: absolute;
  top: 1.5%; left: 1.5%; right: 1.5%; bottom: 1.5%;
  border-radius: 10%;
  overflow: hidden;
  background-color: #111;
  box-shadow: 0 0 10px rgba(0,0,0,0.8);
}

.player-container {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
}

.player-container :deep(iframe) {
  width: 100%; 
  height: 100%; 
  border: none;
  pointer-events: auto; /* Ensure iframe is clickable */
  /* Make youtube video cover the slightly curved edges better without margins */
  transform: scale(1.05); 
}

/* --- CRT Effects --- */
.crt-effects {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; /* Let clicks pass through */
  z-index: 10;
  border-radius: 10%;
  overflow: hidden;
  box-shadow: inset 0 0 2rem rgba(0,0,0,0.9);
}

.scanlines {
  position: absolute; top:0; left:0; width:100%; height:100%;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.25) 50%
  ), 
  linear-gradient(
    90deg, 
    rgba(255, 0, 0, 0.06), 
    rgba(0, 255, 0, 0.02), 
    rgba(0, 0, 255, 0.06)
  );
  background-size: 100% 4px, 4px 100%;
  z-index: 11;
  opacity: 0.8;
  pointer-events: none;
}

.vignette {
  position: absolute; top:0; left:0; width:100%; height:100%;
  background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.85) 100%);
  z-index: 12;
}

.noise {
  position: absolute; top:0; left:0; width:100%; height:100%;
  background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
  opacity: 0.04;
  z-index: 11;
  animation: noiseAnimation 0.2s steps(4) infinite;
}

@keyframes noiseAnimation {
  0% { transform: translate(0,0) }
  25% { transform: translate(-1%,1%) }
  50% { transform: translate(1%,-1%) }
  75% { transform: translate(-1%,-1%) }
  100% { transform: translate(1%,1%) }
}

.glass-reflection {
  position: absolute; 
  top: -60%; left: -60%; 
  width: 220%; height: 220%;
  background: linear-gradient(
    135deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.02) 40%, 
    rgba(255,255,255,0.12) 50%, 
    rgba(255,255,255,0) 55%, 
    rgba(255,255,255,0) 100%
  );
  z-index: 13;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(4px);
}

/* OSD Text */
.osd-text {
  position: absolute;
  color: #3fec3f; /* Vintage green phosphor */
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 1.5rem;
  text-shadow: 0 0 5px #3fec3f, 0 0 15px #3fec3f;
  z-index: 20;
  pointer-events: none;
  text-transform: uppercase;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.osd-text.title { top: 20px; left: 25px; font-size: 1.8rem; }
.osd-text.status { bottom: 20px; right: 25px; }

.blink { animation: crt-blink 1s step-end infinite; }
@keyframes crt-blink { 50% { opacity: 0; } }

/* --- TV Panel --- */
.tv-panel {
  width: 100px;
  background: linear-gradient(to right, #d4cecb, #bcaca4);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5px;
  box-shadow: 
    inset 0 0 10px rgba(0,0,0,0.5), 
    0 5px 15px rgba(0,0,0,0.8);
  border: 3px solid #665b53;
  border-left-color: #8c8279;
  border-top-color: #8c8279;
}

.knobs-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 5px;
}

.knob {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(145deg, #1a1a1a, #333);
  box-shadow: 
    0 5px 10px rgba(0,0,0,0.6),
    inset 0 2px 5px rgba(255,255,255,0.2);
  border: 2px solid #111;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.knob:hover {
  transform: scale(1.05);
}

.knob-marker {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 12px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 3px rgba(255,255,255,0.8);
}

/* Speaker Grille */
.speaker-grille {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 15px 0;
  padding: 10px;
  background: rgba(0,0,0,0.1);
  border-radius: 8px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
}

.grille-row {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.grille-hole {
  width: 6px;
  height: 6px;
  background-color: #222;
  border-radius: 50%;
  box-shadow: inset 0 2px 3px #000, 0 1px 1px rgba(255,255,255,0.4);
}

/* Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 10px;
}

.vintage-btn {
  width: 50px;
  height: 35px;
  border-radius: 5px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.5),
    inset 0 2px 2px rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
  position: relative;
}

.vintage-btn:active {
  transform: translateY(4px);
  box-shadow: 
    0 0px 4px rgba(0,0,0,0.5),
    inset 0 4px 6px rgba(0,0,0,0.4);
}

.btn-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

.claim-btn {
  background: linear-gradient(to bottom, #f2c94c, #f2994a);
  border: 1px solid #d48030;
}

.watch-btn {
  background: linear-gradient(to bottom, #e0e0e0, #bdbdbd);
  border: 1px solid #9e9e9e;
}

.brand {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 900;
  font-size: 0.65rem;
  letter-spacing: 1px;
  color: #222;
  text-shadow: 1px 1px 0px rgba(255,255,255,0.5);
  margin-bottom: 5px;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .tv-inner-body {
    flex-direction: column;
    padding: 15px;
  }
  
  .tv-panel {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    height: auto;
    min-height: 80px;
    padding: 10px 15px;
    justify-content: space-around;
    gap: 10px;
  }
  
  .knobs-container {
    flex-direction: row;
    margin-top: 0;
    gap: 15px;
  }
  
  .knob {
    width: 40px;
    height: 40px;
  }
  
  .speaker-grille {
    flex-direction: row;
    margin: 0;
    gap: 4px;
    padding: 5px;
  }
  
  .grille-row {
    flex-direction: column;
    gap: 4px;
  }

  .grille-hole {
    width: 4px;
    height: 4px;
  }
  
  .action-buttons {
    flex-direction: row;
    margin: 0;
    gap: 10px;
    align-items: center;
  }

  .vintage-btn {
    width: 45px;
    height: 35px;
  }
  
  .brand {
    display: none; /* Hide brand on mobile horizontal panel */
  }
}
</style>