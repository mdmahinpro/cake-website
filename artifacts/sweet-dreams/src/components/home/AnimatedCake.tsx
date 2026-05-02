import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
export type CakeTheme = "vanilla" | "chocolate";

/* ── Theme colour tokens ── */
const THEME = {
  vanilla: {
    s0:"#c89840", s1:"#f4d864", s2:"#d4a840", s3:"#9a6820", s4:"#5a3808",
    t0:"#fce888", t1:"#d4a438", t2:"#7a4010",
    dripColor:"white",    dripOpacity:"0.92",
  },
  chocolate: {
    s0:"#7a3e22", s1:"#b06030", s2:"#8a3a18", s3:"#3e1a08", s4:"#190804",
    t0:"#9a4828", t1:"#5a2810", t2:"#160804",
    dripColor:"#1e0804",  dripOpacity:"0.95",
  },
} as const satisfies Record<CakeTheme, object>;

/* ── Static data ── */
const SCOL = ["#ff6b9d","#00d4ff","#ffd93d","#6bcb77","#ff9a3c","#c77dff","#ff4444","#44eeff"];
function mkSprinkles() {
  const P = [17,31,47,61,79,97,113,127,149,163,181,199];
  const R = [
    {n:13,x0:26,xW:148,y0:171,yH:43},
    {n:9, x0:47,xW:106,y0:113,yH:48},
    {n:6, x0:64,xW:72, y0:66, yH:32},
  ];
  const out:{id:number;x:number;y:number;rot:number;len:number;color:string}[]=[];
  let id=0;
  for(let ri=0;ri<R.length;ri++){
    const r=R[ri];
    for(let i=0;i<r.n;i++){
      out.push({id,
        x:r.x0+(id*P[(id*3)%P.length]*7)%r.xW,
        y:r.y0+(id*P[(id*7+2)%P.length]*3)%r.yH,
        rot:(id*P[(id*11+5)%P.length]*11)%180,
        len:5+(id%4),
        color:SCOL[(id+ri*3)%SCOL.length],
      });id++;
    }
  }
  return out;
}
const SPRINKLES = mkSprinkles();
const CANDLES = [{x:76,c:"#ff6b9d"},{x:90,c:"#00d4ff"},{x:110,c:"#ffd93d"},{x:124,c:"#6bcb77"}];
const DRIPS1 = [36,50,64,78,92,106,120,134,148,162].map((x,i)=>({x,len:8+((x*7+i*13)%14)}));
const DRIPS2 = [46,59,72,86,100,114,128,142].map((x,i)=>({x,len:6+((x*11+i*7)%10)}));

/* ── Sub-components ── */
interface LayerProps { topY:number; height:number; rx:number; sideId:string; topId:string; delay:number; }
function CakeLayer({topY,height,rx,sideId,topId,delay}:LayerProps) {
  const ry=rx*0.2, bottomY=topY+height, cx=100;
  return (
    <motion.g initial={{opacity:0,y:-28}} animate={{opacity:1,y:0}}
      transition={{delay,type:"spring",stiffness:175,damping:22}}>
      <ellipse cx={cx} cy={bottomY+2} rx={rx+4} ry={(rx+4)*0.13} fill="rgba(0,0,0,0.2)"/>
      <path d={`M ${cx-rx},${topY} L ${cx-rx},${bottomY} A ${rx},${ry} 0 0,0 ${cx+rx},${bottomY} L ${cx+rx},${topY} Z`} fill={`url(#${sideId})`}/>
      <path d={`M ${cx-rx},${bottomY} A ${rx},${ry} 0 0,0 ${cx+rx},${bottomY}`} fill="rgba(0,0,0,0.28)"/>
      <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill={`url(#${topId})`}/>
      <path d={`M ${cx-rx},${topY} A ${rx},${ry} 0 0,1 ${cx+rx},${topY}`}
        fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5"/>
    </motion.g>
  );
}

interface FrostProps { y:number; rx:number; delay:number; drips:{x:number;len:number}[]; dripColor:string; dripOpacity:string; }
function FrostingRing({y,rx,delay,drips,dripColor,dripOpacity}:FrostProps) {
  const ry=rx*0.19, ringH=14, cx=100;
  return (
    <motion.g initial={{opacity:0}} animate={{opacity:1}} transition={{delay,duration:0.55}}>
      <path d={`M ${cx-rx},${y} L ${cx-rx},${y+ringH} A ${rx},${ry} 0 0,0 ${cx+rx},${y+ringH} L ${cx+rx},${y} Z`} fill="url(#fSide)"/>
      <path d={`M ${cx-rx},${y+ringH} A ${rx},${ry} 0 0,0 ${cx+rx},${y+ringH}`} fill="#c0c0c0" opacity="0.55"/>
      <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill="url(#fTop)"/>
      <path d={`M ${cx-rx},${y} A ${rx},${ry} 0 0,1 ${cx+rx},${y}`}
        fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
      {drips.map((d)=>(
        <path key={d.x}
          d={`M ${d.x-3.5},${y+ringH} L ${d.x-3},${y+ringH+d.len} Q ${d.x},${y+ringH+d.len+4.5} ${d.x+3},${y+ringH+d.len} L ${d.x+3.5},${y+ringH} Z`}
          fill={dripColor} opacity={dripOpacity}/>
      ))}
    </motion.g>
  );
}

/* ── Main component ── */
export default function AnimatedCake({ theme = "vanilla" }: { theme?: CakeTheme }) {
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(0);
  const sprinkles = useMemo(()=>SPRINKLES,[]);
  const tc = THEME[theme];

  /* Reset + loop whenever cycle OR theme changes */
  useEffect(()=>{
    setPhase(0);
    const T=[
      setTimeout(()=>setPhase(1),  400),
      setTimeout(()=>setPhase(2),  2000),
      setTimeout(()=>setPhase(3),  3500),
      setTimeout(()=>setPhase(4),  5200),
      setTimeout(()=>setPhase(5),  7500),
      setTimeout(()=>setPhase(0),  12600),
      setTimeout(()=>setCycle(c=>c+1), 15700),
    ];
    return ()=>T.forEach(clearTimeout);
  },[cycle, theme]);

  return (
    <svg viewBox="0 0 200 265" className="w-full h-full"
      aria-label="Animated cake baking process" style={{overflow:"visible"}}>

      {/* ── Gradient defs — colours driven by theme prop ── */}
      <defs>
        {/* Cake side — horizontal light-left shadow-right */}
        <linearGradient id="cS1" x1="24"  y1="0" x2="176" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={tc.s0}/>
          <stop offset="22%"  stopColor={tc.s1}/>
          <stop offset="48%"  stopColor={tc.s2}/>
          <stop offset="78%"  stopColor={tc.s3}/>
          <stop offset="100%" stopColor={tc.s4}/>
        </linearGradient>
        <linearGradient id="cS2" x1="45"  y1="0" x2="155" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={tc.s0}/>
          <stop offset="22%"  stopColor={tc.s1}/>
          <stop offset="48%"  stopColor={tc.s2}/>
          <stop offset="78%"  stopColor={tc.s3}/>
          <stop offset="100%" stopColor={tc.s4}/>
        </linearGradient>
        <linearGradient id="cS3" x1="62"  y1="0" x2="138" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={tc.s0}/>
          <stop offset="22%"  stopColor={tc.s1}/>
          <stop offset="48%"  stopColor={tc.s2}/>
          <stop offset="78%"  stopColor={tc.s3}/>
          <stop offset="100%" stopColor={tc.s4}/>
        </linearGradient>
        {/* Cake top face — radial, upper-left = brightest */}
        <radialGradient id="cT" cx="30%" cy="28%" r="72%">
          <stop offset="0%"   stopColor={tc.t0}/>
          <stop offset="45%"  stopColor={tc.t1}/>
          <stop offset="100%" stopColor={tc.t2}/>
        </radialGradient>
        {/* White buttercream frosting */}
        <radialGradient id="fTop" cx="30%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="55%"  stopColor="#f0f0f0"/>
          <stop offset="100%" stopColor="#d0d0d0"/>
        </radialGradient>
        <linearGradient id="fSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f8f8f8"/>
          <stop offset="100%" stopColor="#c4c4c4"/>
        </linearGradient>
        {/* Plate */}
        <radialGradient id="pTop" cx="33%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="65%"  stopColor="#e4e4e4"/>
          <stop offset="100%" stopColor="#b8b8b8"/>
        </radialGradient>
        <linearGradient id="pSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d8d8d8"/>
          <stop offset="100%" stopColor="#9c9c9c"/>
        </linearGradient>
        {/* Flame */}
        <radialGradient id="flame" cx="50%" cy="68%" r="58%">
          <stop offset="0%"   stopColor="#fff9c4"/>
          <stop offset="38%"  stopColor="#ffb300"/>
          <stop offset="100%" stopColor="#ff6d00" stopOpacity="0.72"/>
        </radialGradient>
        {/* Oven glow */}
        <radialGradient id="ovGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#ffbb44" stopOpacity="0.98"/>
          <stop offset="62%"  stopColor="#ff7010" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#cc3800" stopOpacity="0.28"/>
        </radialGradient>
        {/* Bowl */}
        <linearGradient id="bowlExt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#b8d4ee"/>
          <stop offset="38%"  stopColor="#e2f0ff"/>
          <stop offset="100%" stopColor="#6888a8"/>
        </linearGradient>
        <radialGradient id="bowlInt" cx="48%" cy="38%" r="66%">
          <stop offset="0%"   stopColor="#dceeff"/>
          <stop offset="100%" stopColor="#4a6070"/>
        </radialGradient>
        {/* Batter */}
        <radialGradient id="batter" cx="44%" cy="42%" r="65%">
          <stop offset="0%"   stopColor="#f8da70"/>
          <stop offset="100%" stopColor="#bf8e18"/>
        </radialGradient>
        {/* Candle lighting overlay */}
        <linearGradient id="cndLit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.3)"/>
          <stop offset="35%"  stopColor="rgba(255,255,255,0.06)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.28)"/>
        </linearGradient>
        {/* Knob */}
        <radialGradient id="knobFace" cx="33%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#1c3e5e"/>
          <stop offset="100%" stopColor="#071828"/>
        </radialGradient>
        {/* Ambient glow */}
        <radialGradient id="aGlow" cx="50%" cy="70%" r="55%">
          <stop offset="0%"   stopColor="#00beff" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#00beff" stopOpacity="0"/>
        </radialGradient>
        {/* Flame glow filter */}
        <filter id="fg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="100" cy="200" rx="100" ry="70" fill="url(#aGlow)"/>

      {/* ── Theme-keyed wrapper: fades when theme switches ── */}
      <AnimatePresence mode="wait">
        <motion.g key={theme}
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          transition={{duration:0.35}}>

          {/* ═══ SCENE 1+2 : MIXING BOWL ═══ */}
          <AnimatePresence>
            {(phase>=1 && phase<=2) && (
              <motion.g key="bowl"
                initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
                exit={{opacity:0,y:-22,scale:0.88}} transition={{duration:0.55}}>
                <ellipse cx="100" cy="234" rx="62" ry="9" fill="rgba(0,0,0,0.22)"/>
                <path d="M 34,126 Q 26,164 37,198 Q 55,230 100,235 Q 145,230 163,198 Q 174,164 166,126 Z" fill="url(#bowlExt)"/>
                <path d="M 40,131 Q 33,168 44,196 Q 61,224 100,228 Q 139,224 156,196 Q 167,168 160,131 Z" fill="url(#bowlInt)"/>
                <ellipse cx="100" cy="126" rx="66" ry="11" fill="#d4e8fa"/>
                <path d="M 34,126 A 66,11 0 0,1 166,126" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                <ellipse cx="100" cy="131" rx="58" ry="8" fill="#90aec8" opacity="0.45"/>
                {/* Batter */}
                <AnimatePresence>
                  {phase>=2 && (
                    <motion.ellipse key="bat" cx="100" cy="214" rx="50" ry="9" fill="url(#batter)"
                      initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:0.9}}
                      exit={{opacity:0}} transition={{duration:0.5}}
                      style={{transformOrigin:"100px 214px"}}/>
                  )}
                </AnimatePresence>
                {/* Swirl */}
                <AnimatePresence>
                  {phase>=2 && (
                    <motion.g key="swirl" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.35}}>
                      <motion.path
                        d="M 100,208 C 113,205 119,212 112,217 C 104,222 90,217 94,211 C 98,205 114,207 113,213"
                        fill="none" stroke="#c89018" strokeWidth="2.5" strokeLinecap="round"
                        animate={{rotate:[0,360]}} transition={{duration:1.5,repeat:1,ease:"linear"}}
                        style={{transformOrigin:"100px 213px"}}/>
                    </motion.g>
                  )}
                </AnimatePresence>
                {/* Whisk */}
                <AnimatePresence>
                  {phase>=2 && (
                    <motion.g key="whisk"
                      initial={{opacity:0,rotate:-22}} animate={{opacity:1,rotate:[-22,16,-22]}}
                      exit={{opacity:0}} transition={{duration:0.9,repeat:1}}
                      style={{transformOrigin:"136px 122px"}}>
                      <line x1="136" y1="72" x2="122" y2="155" stroke="#8a7a6a" strokeWidth="3" strokeLinecap="round"/>
                      <ellipse cx="119" cy="159" rx="9" ry="14" fill="none" stroke="#aaa" strokeWidth="1.5"/>
                      <line x1="114" y1="152" x2="124" y2="168" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="124" y1="152" x2="114" y2="168" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="119" y1="145" x2="119" y2="173" stroke="#aaa" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                    </motion.g>
                  )}
                </AnimatePresence>
                {/* Ingredients */}
                {[
                  {x:84, y:58, color:"#fff6e0", r:9,   delay:0,    id:"fl"},
                  {x:116,y:38, color:"#ffe8a0", r:7.5, delay:0.3,  id:"bt"},
                  {x:96, y:48, color:"#f8e060", r:6.5, delay:0.58, id:"eg"},
                  {x:76, y:28, color:"#f0f0ea", r:5.5, delay:0.85, id:"sg"},
                ].map((ing)=>(
                  <motion.circle key={ing.id} cx={ing.x} cy={ing.y} r={ing.r}
                    fill={ing.color} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5"
                    initial={{y:0,opacity:0}} animate={{y:76,opacity:[0,1,1,0]}}
                    transition={{delay:ing.delay,duration:0.85,ease:"easeIn"}}/>
                ))}
                <motion.ellipse cx="86" cy="126" rx="18" ry="5" fill="rgba(255,255,255,0.65)"
                  initial={{opacity:0,scaleX:0}} animate={{opacity:[0,0.65,0],scaleX:[0,1.7,0]}}
                  transition={{delay:0.9,duration:0.75}} style={{transformOrigin:"86px 126px"}}/>
              </motion.g>
            )}
          </AnimatePresence>

          {/* ═══ SCENE 3 : OVEN ═══ */}
          <AnimatePresence>
            {phase===3 && (
              <motion.g key="oven"
                initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
                exit={{opacity:0,y:-22}} transition={{duration:0.55}}>
                <ellipse cx="100" cy="228" rx="86" ry="10" fill="rgba(0,0,0,0.28)"/>
                <path d="M 18,56 L 182,56 L 178,46 L 22,46 Z" fill="#0c2038"/>
                <path d="M 182,56 L 182,220 L 178,224 L 178,46 Z" fill="#050e18"/>
                <rect x="18" y="56" width="164" height="164" rx="11" fill="#071626"/>
                <rect x="18" y="56" width="164" height="164" rx="11" fill="none" stroke="#00beff" strokeWidth="0.9" opacity="0.35"/>
                <rect x="18" y="56" width="164" height="36" rx="11" fill="#0c2038"/>
                <rect x="18" y="84" width="164" height="8" rx="0" fill="#061020"/>
                {[50,100,150].map((kx,ki)=>(
                  <g key={kx}>
                    <circle cx={kx} cy="73" r="13" fill="#071626" stroke="#00beff" strokeWidth="1.5"/>
                    <circle cx={kx} cy="72" r="9.5" fill="url(#knobFace)"/>
                    <ellipse cx={kx-3} cy={69} rx="3.5" ry="2.5" fill="rgba(255,255,255,0.3)"/>
                    <motion.line x1={kx} y1={66} x2={kx} y2={62} stroke="#00beff" strokeWidth="2" strokeLinecap="round"
                      animate={{rotate:[0,ki===1?180:270]}}
                      transition={{delay:0.2,duration:1.4,repeat:Infinity,ease:"linear"}}
                      style={{transformOrigin:`${kx}px 73px`}}/>
                  </g>
                ))}
                <rect x="116" y="60" width="52" height="17" rx="3" fill="#00060e"/>
                <text x="142" y="72" textAnchor="middle" fontSize="9" fill="#ff9a3c" fontFamily="monospace" fontWeight="bold">180°C</text>
                <rect x="30" y="98" width="140" height="112" rx="9" fill="#040c14"/>
                <rect x="46" y="112" width="108" height="82" rx="7" fill="url(#ovGlow)"/>
                <rect x="46" y="112" width="108" height="82" rx="7" fill="none" stroke="#ff8030" strokeWidth="0.8"/>
                <motion.rect x="46" y="112" width="108" height="82" rx="7" fill="rgba(255,140,40,0.15)"
                  animate={{opacity:[0.4,1,0.4]}} transition={{duration:1.4,repeat:Infinity}}/>
                <motion.g initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.65}}>
                  <rect x="56" y="162" width="88" height="23" rx="5" fill="#c8903c"/>
                  <rect x="56" y="154" width="88" height="11" rx="4" fill="#daa852"/>
                  <motion.path d="M 60,154 Q 100,136 140,154" fill="#ecc068"
                    initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}}/>
                  <rect x="48" y="157" width="10" height="8" rx="2" fill="#b07828"/>
                  <rect x="142" y="157" width="10" height="8" rx="2" fill="#b07828"/>
                </motion.g>
                <rect x="70" y="200" width="60" height="10" rx="5" fill="#2888b8"/>
                <rect x="70" y="200" width="60" height="3.5" rx="2" fill="rgba(255,255,255,0.45)"/>
                <rect x="70" y="205" width="60" height="5" rx="2.5" fill="#1060a0"/>
                {[54,74,100,126,146].map((wx,wi)=>(
                  <motion.path key={wx}
                    d={`M${wx},44 C${wx-5},36 ${wx+5},28 ${wx},20`}
                    fill="none" stroke="#ff9030" strokeWidth="2" strokeLinecap="round"
                    animate={{y:[-2,-10,-2],opacity:[0.75,0.1,0.75]}}
                    transition={{delay:wi*0.18,duration:1.3,repeat:Infinity,ease:"easeInOut"}}/>
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* ═══ SCENE 4+5 : CAKE ═══ */}
          <AnimatePresence>
            {phase>=4 && (
              <motion.g key="cake" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.65}}>
                {/* Plate */}
                <ellipse cx="100" cy="257" rx="90" ry="13" fill="#aaaaaa"/>
                <rect x="10" y="243" width="180" height="13" fill="url(#pSide)"/>
                <ellipse cx="100" cy="243" rx="90" ry="14" fill="url(#pTop)"/>
                <path d="M 10,243 A 90,14 0 0,1 190,243" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5"/>

                {/* Layer 1 */}
                <CakeLayer topY={180} height={62} rx={76} sideId="cS1" topId="cT" delay={0.2}/>
                {/* Frosting 1 */}
                <FrostingRing y={180} rx={80} delay={0.72} drips={DRIPS1} dripColor={tc.dripColor} dripOpacity={tc.dripOpacity}/>
                {/* Layer 2 */}
                <CakeLayer topY={118} height={62} rx={55} sideId="cS2" topId="cT" delay={1.1}/>
                {/* Frosting 2 */}
                <FrostingRing y={118} rx={59} delay={1.65} drips={DRIPS2} dripColor={tc.dripColor} dripOpacity={tc.dripOpacity}/>
                {/* Layer 3 */}
                <CakeLayer topY={70} height={48} rx={38} sideId="cS3" topId="cT" delay={2.05}/>

                {/* Decorations */}
                {phase>=5 && (
                  <motion.g initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
                    {/* Top frosting cap */}
                    <motion.g initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}>
                      <path d="M 58,65 L 58,80 A 42,8 0 0,0 142,80 L 142,65 Z" fill="url(#fSide)"/>
                      <path d="M 58,80 A 42,8 0 0,0 142,80" fill="#c0c0c0" opacity="0.5"/>
                      <ellipse cx="100" cy="65" rx="42" ry="8" fill="url(#fTop)"/>
                      <path d="M 58,65 A 42,8 0 0,1 142,65" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
                    </motion.g>

                    {/* Rosettes */}
                    {([78,100,122] as number[]).map((rx2,ri)=>(
                      <motion.g key={rx2}
                        initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}}
                        transition={{delay:0.28+ri*0.14,type:"spring",stiffness:260,damping:18}}
                        style={{transformOrigin:`${rx2}px 63px`}}>
                        {([0,72,144,216,288] as number[]).map((a)=>{
                          const rad=a*Math.PI/180;
                          const px=rx2+Math.cos(rad)*5.5, py=63+Math.sin(rad)*3;
                          return <ellipse key={a} cx={px} cy={py} rx="4.5" ry="2.8" fill="#ff90be" opacity="0.92"
                            transform={`rotate(${a} ${px} ${py})`}/>;
                        })}
                        <circle cx={rx2} cy={63} r="3.8" fill="#ffd4e8"/>
                        <circle cx={rx2-1} cy={62} r="1.6" fill="rgba(255,255,255,0.72)"/>
                      </motion.g>
                    ))}

                    {/* Candles */}
                    {CANDLES.map((cd,ci)=>(
                      <motion.g key={cd.x}
                        initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}}
                        transition={{delay:0.55+ci*0.18,type:"spring",stiffness:280}}>
                        <path d={`M ${cd.x-4},28 L ${cd.x-4},64 A 4,0.9 0 0,0 ${cd.x+4},64 L ${cd.x+4},28 Z`} fill={cd.c}/>
                        <path d={`M ${cd.x-4},28 L ${cd.x-4},64 A 4,0.9 0 0,0 ${cd.x+4},64 L ${cd.x+4},28 Z`} fill="url(#cndLit)"/>
                        <rect x={cd.x-2} y="32" width="1.5" height="26" rx="0.75" fill="rgba(255,255,255,0.38)"/>
                        <ellipse cx={cd.x} cy="28" rx="4" ry="0.9" fill={cd.c} style={{filter:"brightness(1.4)"}}/>
                        <ellipse cx={cd.x} cy="28" rx="4.5" ry="1.1" fill="rgba(255,255,255,0.18)"/>
                        <line x1={cd.x} y1="21" x2={cd.x} y2="28" stroke="#2e2020" strokeWidth="1.3" strokeLinecap="round"/>
                        <motion.g style={{transformOrigin:`${cd.x}px 14px`}}
                          animate={{scaleX:[1,0.68,1.28,0.82,1.08,1],scaleY:[1,1.32,0.72,1.22,0.88,1]}}
                          transition={{duration:0.88,repeat:Infinity,ease:"easeInOut",delay:ci*0.14}}>
                          <ellipse cx={cd.x} cy="14" rx="7" ry="13" fill="#ff7010" opacity="0.22" filter="url(#fg)"/>
                          <ellipse cx={cd.x} cy="14" rx="4.5" ry="9" fill="url(#flame)"/>
                          <ellipse cx={cd.x} cy="16" rx="2" ry="4.5" fill="#fff9c4" opacity="0.96"/>
                          <circle cx={cd.x} cy={9} r="1.2" fill="#ffffff" opacity="0.8"/>
                        </motion.g>
                      </motion.g>
                    ))}

                    {/* Sprinkles */}
                    {sprinkles.map((s,si)=>(
                      <motion.rect key={s.id}
                        x={s.x} y={s.y} width={s.len} height="3" rx="1.5" fill={s.color}
                        transform={`rotate(${s.rot} ${s.x+s.len/2} ${s.y+1.5})`}
                        initial={{opacity:0,scale:0}} animate={{opacity:0.93,scale:1}}
                        transition={{delay:si*0.022,type:"spring",stiffness:340,damping:20}}
                        style={{transformOrigin:`${s.x+s.len/2}px ${s.y+1.5}px`}}/>
                    ))}
                  </motion.g>
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Phase caption */}
          <AnimatePresence mode="wait">
            {phase===1 && <motion.text key="p1" x="100" y="261" textAnchor="middle" fontSize="10" fill="#a8d4ff" fontFamily="sans-serif" initial={{opacity:0}} animate={{opacity:0.8}} exit={{opacity:0}} transition={{duration:0.35}}>Gathering ingredients…</motion.text>}
            {phase===2 && <motion.text key="p2" x="100" y="261" textAnchor="middle" fontSize="10" fill="#a8d4ff" fontFamily="sans-serif" initial={{opacity:0}} animate={{opacity:0.8}} exit={{opacity:0}} transition={{duration:0.35}}>Mixing the batter…</motion.text>}
            {phase===3 && <motion.text key="p3" x="100" y="261" textAnchor="middle" fontSize="10" fill="#ffa050" fontFamily="sans-serif" fontWeight="bold" initial={{opacity:0}} animate={{opacity:0.9}} exit={{opacity:0}} transition={{duration:0.35}}>Baking to perfection…</motion.text>}
            {phase===4 && <motion.text key="p4" x="100" y="261" textAnchor="middle" fontSize="10" fill="#a8d4ff" fontFamily="sans-serif" initial={{opacity:0}} animate={{opacity:0.8}} exit={{opacity:0}} transition={{duration:0.35}}>Assembling layers…</motion.text>}
            {phase===5 && <motion.text key="p5" x="100" y="261" textAnchor="middle" fontSize="10" fill="#ffd93d" fontFamily="sans-serif" fontWeight="bold" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.35}}>Your dream cake is ready!</motion.text>}
          </AnimatePresence>

        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
