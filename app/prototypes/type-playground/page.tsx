'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import gamificationStyles from './gamification.module.css';

interface FontData {
  family: string;
  variants: string[];
  category: string;
  source?: 'google' | 'fontshare' | 'custom';
  customUrl?: string;
}

interface StyleProperties {
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  color: string;
  opacity: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  positionX: number;
  positionY: number;
}

interface Keyframe {
  id: string;
  time: number;
  properties: Partial<StyleProperties>;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

type ParticleMode = 'normal' | 'disperse' | 'swirl' | 'wave' | 'glitch' | 'orbit';

export default function TypePlayground() {
  const [text, setText] = useState('Typography');
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [googleFonts, setGoogleFonts] = useState<FontData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSource, setFontSource] = useState<'google' | 'fontshare' | 'all'>('all');
  const [customFonts, setCustomFonts] = useState<FontData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  // Typographic Experiment Mode
  const [experimentMode, setExperimentMode] = useState(false);
  const [experimentIntensity, setExperimentIntensity] = useState(50);
  const [experimentRadius, setExperimentRadius] = useState(150);
  const [experimentType, setExperimentType] = useState<'rotate' | 'shift' | 'scale' | 'skew'>('rotate');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  // Hover Glow Mode
  const [hoverGlowMode, setHoverGlowMode] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(50);
  const [glowRadius, setGlowRadius] = useState(100);
  const [glowColor, setGlowColor] = useState('#00c8ff');
  
  // Grid Dot Mode
  const [gridDotMode, setGridDotMode] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [dotSize, setDotSize] = useState(6);
  
  // Type Creature Mode
  const [creatureMode, setCreatureMode] = useState(false);
  const [creatureMood, setCreatureMood] = useState(0);
  const [creatureMessages, setCreatureMessages] = useState<string[]>([]);
  const [lastParamChange, setLastParamChange] = useState(Date.now());
  
  // Glitch Mode
  const [glitchMode, setGlitchMode] = useState(false);
  const [glitchedText, setGlitchedText] = useState('');
  const [glitchTimer, setGlitchTimer] = useState(10);
  const [glitchActive, setGlitchActive] = useState(false);
  const glitchTimerRef = useRef<number | null>(null);
  
  // Animation Timeline
  const [timelineIsPlaying, setTimelineIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  
  // Features section collapsed state
  const [featuresExpanded, setFeaturesExpanded] = useState(true);
  const [videoSupported, setVideoSupported] = useState(true);
  
  // Gamification State
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'achievement' | 'xp' | 'level'}>>([]);
  const [stats, setStats] = useState({
    fontsUsed: 0,
    experimentsRun: 0,
    particlesEnabled: 0,
    exportsCompleted: 0,
    keyframesCreated: 0,
    themeSwitches: 0,
  });
  const [showStats, setShowStats] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<string>('');
  const [combo, setCombo] = useState(0);
  const comboTimeoutRef = useRef<number | null>(null);
  
  // Particle system state
  const [particleMode, setParticleMode] = useState<ParticleMode>('normal');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleDensity, setParticleDensity] = useState(3);
  const [particleSpeed, setParticleSpeed] = useState(1);
  const [particleSize, setParticleSize] = useState(2);
  const [particleChaos, setParticleChaos] = useState(0.5);
  const [enableParticles, setEnableParticles] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'error'>('error');
  const [showTimeline, setShowTimeline] = useState(true);
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    {
      id: '0',
      time: 0,
      properties: {
        fontSize: 72,
        fontWeight: 400,
        letterSpacing: 0,
        lineHeight: 1.2,
        color: '#000000',
        opacity: 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        positionX: 50,
        positionY: 50
      }
    }
  ]);
  
  const [currentStyle, setCurrentStyle] = useState<StyleProperties>({
    fontSize: 72,
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.2,
    color: '#000000',
    opacity: 1,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    positionX: 50,
    positionY: 50
  });

  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textPreviewRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const experimentCanvasRef = useRef<HTMLCanvasElement>(null);
  const gridDotCanvasRef = useRef<HTMLCanvasElement>(null);
  const particleAnimationRef = useRef<number | undefined>(undefined);
  
  // Gamification Functions
  const addXP = (amount: number, reason: string) => {
    setXp(prev => {
      const newXP = prev + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      if (newLevel > level) {
        setLevel(newLevel);
        addNotification(`LEVEL UP! Level ${newLevel}`, 'level');
      }
      
      addNotification(`+${amount} XP: ${reason}`, 'xp');
      return newXP;
    });
  };
  
  const addNotification = (message: string, type: 'achievement' | 'xp' | 'level') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };
  
  const unlockAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      addNotification(`🏆 ACHIEVEMENT: ${achievement}`, 'achievement');
      addXP(50, 'Achievement Unlocked');
    }
  };
  
  const increaseCombo = () => {
    setCombo(prev => prev + 1);
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
    }
    comboTimeoutRef.current = window.setTimeout(() => {
      setCombo(0);
    }, 3000);
  };
  
  const checkAchievements = () => {
    // Font Explorer
    if (stats.fontsUsed >= 5 && !achievements.includes('Font Explorer')) {
      unlockAchievement('Font Explorer');
    }
    if (stats.fontsUsed >= 20 && !achievements.includes('Font Master')) {
      unlockAchievement('Font Master');
    }
    
    // Experimenter
    if (stats.experimentsRun >= 10 && !achievements.includes('Mad Scientist')) {
      unlockAchievement('Mad Scientist');
    }
    
    // Particle Pro
    if (stats.particlesEnabled >= 5 && !achievements.includes('Particle Pro')) {
      unlockAchievement('Particle Pro');
    }
    
    // Export Expert
    if (stats.exportsCompleted >= 3 && !achievements.includes('Export Expert')) {
      unlockAchievement('Export Expert');
    }
    
    // Keyframe King
    if (stats.keyframesCreated >= 10 && !achievements.includes('Keyframe King')) {
      unlockAchievement('Keyframe King');
    }
    
    // Theme Hopper
    if (stats.themeSwitches >= 5 && !achievements.includes('Theme Hopper')) {
      unlockAchievement('Theme Hopper');
    }
  };

  // Type Creature Functions
  const addCreatureMessage = (message: string) => {
    setCreatureMessages(prev => [...prev.slice(-2), message]);
    setTimeout(() => {
      setCreatureMessages(prev => prev.filter(m => m !== message));
    }, 3000);
  };

  const feedCreature = () => {
    setCreatureMood(prev => Math.min(prev + 10, 100));
    const messages = [
      '>> TYPE_CREATURE_HUNGRY',
      '>> FEEDING... PARAMETERS DIGESTED.',
      '>> CREATURE_EVOLVING... COMPLETE.',
      '>> MOOD STABILIZING...',
      '>> CREATURE_CONTENT'
    ];
    addCreatureMessage(messages[Math.floor(Math.random() * messages.length)]);
    addXP(5, 'Fed creature');
  };

  // Glitch Mode Functions
  const scrambleText = (originalText: string): string => {
    const chars = originalText.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    // Add occasional missing glyphs
    return chars.map(c => Math.random() > 0.9 ? '█' : c).join('');
  };

  const activateGlitch = () => {
    if (glitchActive) return;
    
    setGlitchActive(true);
    setGlitchedText(scrambleText(text));
    setGlitchTimer(10);
    addCreatureMessage('>> SYSTEM_ERROR: TEXT_CORRUPTED');
    addCreatureMessage('>> RESTORE ORDER USING SLIDERS OR KEYS');
    
    // Start countdown
    if (glitchTimerRef.current) clearInterval(glitchTimerRef.current);
    glitchTimerRef.current = window.setInterval(() => {
      setGlitchTimer(prev => {
        if (prev <= 1) {
          resetGlitch();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const checkGlitchRestored = () => {
    if (glitchedText === text) {
      if (glitchTimerRef.current) clearInterval(glitchTimerRef.current);
      setGlitchActive(false);
      addCreatureMessage('>> ORDER RESTORED. BONUS: +10 XP');
      addXP(10, 'Restored glitched text');
      increaseCombo();
    }
  };

  const resetGlitch = () => {
    if (glitchTimerRef.current) clearInterval(glitchTimerRef.current);
    setGlitchActive(false);
    setGlitchedText('');
    addCreatureMessage('>> SYSTEM REBOOTING...');
  };

  // Timeline Animation Functions
  const interpolateProperties = (prop1: Partial<StyleProperties>, prop2: Partial<StyleProperties>, t: number): StyleProperties => {
    const result: any = {};
    const keys = new Set([...Object.keys(prop1), ...Object.keys(prop2)]) as Set<keyof StyleProperties>;
    
    keys.forEach(key => {
      const val1 = prop1[key] ?? currentStyle[key];
      const val2 = prop2[key] ?? currentStyle[key];
      
      if (typeof val1 === 'number' && typeof val2 === 'number') {
        result[key] = val1 + (val2 - val1) * t;
      } else {
        result[key] = t < 0.5 ? val1 : val2;
      }
    });
    
    return { ...currentStyle, ...result };
  };

  const playTimeline = () => {
    if (keyframes.length < 2) {
      addCreatureMessage('>> ERROR: NEED 2+ KEYFRAMES TO PLAY');
      return;
    }
    
    setTimelineIsPlaying(true);
    setPlaybackProgress(0);
    addCreatureMessage('>> PLAYBACK_INITIATED');
    addXP(5, 'Started timeline playback');
  };

  const stopTimeline = () => {
    setTimelineIsPlaying(false);
    setPlaybackProgress(0);
    addCreatureMessage('>> PLAYBACK_STOPPED');
  };

  // Check achievements whenever stats change
  useEffect(() => {
    checkAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  // Set daily challenge
  useEffect(() => {
    const challenges = [
      'Try 5 different fonts today',
      'Create 3 keyframes for an animation',
      'Experiment with all 4 typography modes',
      'Export your design in 3 different formats',
      'Switch themes 3 times',
      'Enable particles and adjust all settings',
      'Create a grid dot design with text',
      'Build a 5-second animation'
    ];
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setDailyChallenge(randomChallenge);
  }, []);

  // Type Creature mood decay
  useEffect(() => {
    if (!creatureMode) return;
    
    const interval = setInterval(() => {
      setCreatureMood(prev => Math.max(prev - 1, 0));
      if (creatureMood < 20) {
        addCreatureMessage('>> TYPE_CREATURE_HUNGRY');
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [creatureMode, creatureMood]);

  // Track parameter changes for creature feeding
  useEffect(() => {
    if (!creatureMode) return;
    setLastParamChange(Date.now());
    feedCreature();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStyle, selectedFont, text]);

  // Check if glitch is restored
  useEffect(() => {
    if (glitchActive) {
      checkGlitchRestored();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, glitchActive]);

  // Timeline playback animation
  useEffect(() => {
    if (!timelineIsPlaying || keyframes.length < 2) return;
    
    const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
    const maxTime = sortedKeyframes[sortedKeyframes.length - 1].time;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / maxTime, 1);
      setPlaybackProgress(progress * 100);
      
      // Find current keyframe segment
      for (let i = 0; i < sortedKeyframes.length - 1; i++) {
        const kf1 = sortedKeyframes[i];
        const kf2 = sortedKeyframes[i + 1];
        
        if (elapsed >= kf1.time && elapsed < kf2.time) {
          const segmentProgress = (elapsed - kf1.time) / (kf2.time - kf1.time);
          const interpolated = interpolateProperties(kf1.properties, kf2.properties, segmentProgress);
          setCurrentStyle(interpolated);
          break;
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        stopTimeline();
      }
    };
    
    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineIsPlaying, keyframes]);

  // Check video export support
  useEffect(() => {
    if (typeof MediaRecorder === 'undefined') {
      setVideoSupported(false);
      return;
    }
    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    const supported = mimeTypes.some(type => MediaRecorder.isTypeSupported(type));
    setVideoSupported(supported);
  }, []);

  // Load Google Fonts
  useEffect(() => {
    const loadGoogleFonts = async () => {
      try {
        const popularFonts: FontData[] = [
          { family: 'Inter', variants: ['400', '700'], category: 'sans-serif', source: 'google' },
          { family: 'Roboto', variants: ['400', '700'], category: 'sans-serif', source: 'google' },
          { family: 'Playfair Display', variants: ['400', '700'], category: 'serif', source: 'google' },
          { family: 'Montserrat', variants: ['400', '700'], category: 'sans-serif', source: 'google' },
          { family: 'Lora', variants: ['400', '700'], category: 'serif', source: 'google' },
          { family: 'Oswald', variants: ['400', '700'], category: 'sans-serif', source: 'google' },
          { family: 'Raleway', variants: ['400', '700'], category: 'sans-serif', source: 'google' },
          { family: 'Merriweather', variants: ['400', '700'], category: 'serif', source: 'google' },
          { family: 'Bebas Neue', variants: ['400'], category: 'display', source: 'google' },
          { family: 'Poppins', variants: ['400', '700'], category: 'sans-serif', source: 'google' },
          // Fontshare fonts
          { family: 'Satoshi', variants: ['400', '700'], category: 'sans-serif', source: 'fontshare' },
          { family: 'General Sans', variants: ['400', '700'], category: 'sans-serif', source: 'fontshare' },
          { family: 'Cabinet Grotesk', variants: ['400', '700'], category: 'sans-serif', source: 'fontshare' },
          { family: 'Switzer', variants: ['400', '700'], category: 'sans-serif', source: 'fontshare' },
          { family: 'Clash Display', variants: ['400', '700'], category: 'display', source: 'fontshare' },
          { family: 'Author', variants: ['400', '700'], category: 'sans-serif', source: 'fontshare' },
          { family: 'Chillax', variants: ['400', '700'], category: 'display', source: 'fontshare' },
          { family: 'Zodiak', variants: ['400', '700'], category: 'serif', source: 'fontshare' }
        ];
        setGoogleFonts(popularFonts);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };
    loadGoogleFonts();
  }, []);

  // Load selected font
  useEffect(() => {
    const allFonts = [...googleFonts, ...customFonts];
    const fontData = allFonts.find(f => f.family === selectedFont);
    
    if (fontData?.source === 'custom' && fontData.customUrl) {
      // Custom font already loaded via FontFace API
      return;
    } else if (fontData?.source === 'fontshare') {
      // Load from Fontshare CDN
      const link = document.createElement('link');
      link.href = `https://api.fontshare.com/v2/css?f[]=${selectedFont.toLowerCase().replace(/\s+/g, '-')}@400,700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    } else {
      // Load from Google Fonts
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [selectedFont, googleFonts, customFonts]);

  // Animation playback
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now() - currentTime * 1000;
      
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) return;
        
        const elapsed = (timestamp - startTimeRef.current) / 1000;
        
        if (elapsed >= duration) {
          setCurrentTime(duration);
          setIsPlaying(false);
          return;
        }
        
        setCurrentTime(elapsed);
        updateStyleAtTime(elapsed);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration]);

  const updateStyleAtTime = (time: number) => {
    const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
    
    const beforeKeyframe = sortedKeyframes.filter(k => k.time <= time).pop();
    const afterKeyframe = sortedKeyframes.find(k => k.time > time);
    
    if (!beforeKeyframe) return;
    if (!afterKeyframe) {
      setCurrentStyle(prev => ({ ...prev, ...beforeKeyframe.properties }));
      return;
    }
    
    const progress = (time - beforeKeyframe.time) / (afterKeyframe.time - beforeKeyframe.time);
    const interpolated: Partial<StyleProperties> = {};
    
    const keys = Object.keys(beforeKeyframe.properties) as (keyof StyleProperties)[];
    keys.forEach(key => {
      const before = beforeKeyframe.properties[key];
      const after = afterKeyframe.properties[key];
      
      if (typeof before === 'number' && typeof after === 'number') {
        interpolated[key] = before + (after - before) * progress as any;
      } else if (typeof before === 'string' && typeof after === 'string') {
        interpolated[key] = progress < 0.5 ? before : after as any;
      }
    });
    
    setCurrentStyle(prev => ({ ...prev, ...interpolated }));
  };

  const addKeyframe = () => {
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      time: currentTime,
      properties: { ...currentStyle }
    };
    setKeyframes([...keyframes, newKeyframe].sort((a, b) => a.time - b.time));
    
    // Gamification
    setStats(prev => ({ ...prev, keyframesCreated: prev.keyframesCreated + 1 }));
    addXP(8, 'Created keyframe');
    increaseCombo();
  };

  const deleteKeyframe = (id: string) => {
    setKeyframes(keyframes.filter(k => k.id !== id));
  };

  // Handle font file upload
  const handleFontUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name;
      const fontName = fileName.replace(/\.(otf|ttf)$/i, '');

      try {
        const fontUrl = URL.createObjectURL(file);
        const fontFace = new FontFace(fontName, `url(${fontUrl})`);
        await fontFace.load();
        document.fonts.add(fontFace);

        const newFont: FontData = {
          family: fontName,
          variants: ['400'],
          category: 'custom',
          source: 'custom',
          customUrl: fontUrl
        };

        setCustomFonts(prev => [...prev, newFont]);
        setSelectedFont(fontName);
        
        // Gamification
        addXP(15, 'Uploaded custom font');
        increaseCombo();
      } catch (error) {
        console.error('Error loading font:', error);
        alert(`Failed to load font: ${fileName}`);
      }
    }
  };

  const allFonts = [...googleFonts, ...customFonts];
  
  const filteredFonts = allFonts.filter(font => {
    const matchesSearch = font.family.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = fontSource === 'all' || font.source === fontSource;
    return matchesSearch && matchesSource;
  });

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * duration;
    setCurrentTime(newTime);
    updateStyleAtTime(newTime);
  };

  // Export functions
  const renderToCanvas = (time: number, width: number = 1920, height: number = 1080): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Get style at this time
    const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
    const beforeKeyframe = sortedKeyframes.filter(k => k.time <= time).pop();
    const afterKeyframe = sortedKeyframes.find(k => k.time > time);
    
    let frameStyle = { ...currentStyle };
    if (beforeKeyframe && afterKeyframe) {
      const progress = (time - beforeKeyframe.time) / (afterKeyframe.time - beforeKeyframe.time);
      const keys = Object.keys(beforeKeyframe.properties) as (keyof StyleProperties)[];
      keys.forEach(key => {
        const before = beforeKeyframe.properties[key];
        const after = afterKeyframe.properties[key];
        if (typeof before === 'number' && typeof after === 'number') {
          (frameStyle as any)[key] = before + (after - before) * progress;
        } else if (typeof before === 'string' && typeof after === 'string') {
          (frameStyle as any)[key] = progress < 0.5 ? before : after;
        }
      });
    } else if (beforeKeyframe) {
      frameStyle = { ...frameStyle, ...beforeKeyframe.properties } as StyleProperties;
    }

    // Apply transforms and render text
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.translate((frameStyle.positionX - 50) * 10, (frameStyle.positionY - 50) * 10);
    ctx.rotate((frameStyle.rotation * Math.PI) / 180);
    ctx.scale(frameStyle.scaleX, frameStyle.scaleY);
    ctx.globalAlpha = frameStyle.opacity;

    ctx.font = `${frameStyle.fontWeight} ${frameStyle.fontSize}px ${selectedFont}`;
    ctx.fillStyle = frameStyle.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeightPx = frameStyle.fontSize * frameStyle.lineHeight;
    const totalHeight = lineHeightPx * lines.length;
    const startY = -totalHeight / 2 + lineHeightPx / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, 0, startY + i * lineHeightPx);
    });

    ctx.restore();
    return canvas;
  };

  const exportAsVideo = async (format: 'webm' | 'mp4' = 'webm') => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Check MediaRecorder support
      if (typeof MediaRecorder === 'undefined') {
        throw new Error('MediaRecorder is not supported in this browser');
      }

      // Find supported MIME type
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ];

      let supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
      
      if (!supportedMimeType) {
        throw new Error('No supported video format found. Try exporting as PNG Sequence instead.');
      }

      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      const stream = canvas.captureStream(30); // 30 FPS
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: supportedMimeType,
        videoBitsPerSecond: 5000000 
      });
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      const recordingComplete = new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: supportedMimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const extension = supportedMimeType.includes('webm') ? 'webm' : 'mp4';
          a.download = `typography-animation.${extension}`;
          a.click();
          URL.revokeObjectURL(url);
          setIsExporting(false);
          setExportProgress(0);
          resolve();
        };
      });

      mediaRecorder.start(100); // Collect data every 100ms

      const fps = 30;
      const frameCount = Math.ceil(duration * fps);
      const frameDelay = 1000 / fps;
      
      for (let i = 0; i <= frameCount; i++) {
        const time = (i / frameCount) * duration;
        const frameCanvas = renderToCanvas(time, 1920, 1080);
        ctx.drawImage(frameCanvas, 0, 0);
        setExportProgress(Math.round((i / frameCount) * 100));
        await new Promise(resolve => setTimeout(resolve, frameDelay));
      }

      mediaRecorder.stop();
      await recordingComplete;
      
    } catch (error: any) {
      console.error('Export failed:', error);
      alert(error.message || 'Video export failed. Try exporting as PNG Sequence instead.');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportAsGIF = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // We'll use a simple approach: export frames and let the browser handle it
      // For a real GIF, you'd use a library like gif.js
      const fps = 15; // Lower FPS for GIF
      const frameCount = Math.ceil(duration * fps);
      const frames: string[] = [];

      for (let i = 0; i <= frameCount; i++) {
        const time = (i / frameCount) * duration;
        const canvas = renderToCanvas(time, 800, 600); // Smaller for GIF
        frames.push(canvas.toDataURL('image/png'));
        setExportProgress(Math.round((i / frameCount) * 100));
      }

      // For now, export as image sequence (ZIP would require additional library)
      alert('GIF export: Please use the PNG Sequence export and use an external tool to create a GIF.');
      setIsExporting(false);
      setExportProgress(0);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportAsPNGSequence = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const fps = 30;
      const frameCount = Math.ceil(duration * fps);

      for (let i = 0; i <= frameCount; i++) {
        const time = (i / frameCount) * duration;
        const canvas = renderToCanvas(time, 1920, 1080);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `frame_${String(i).padStart(4, '0')}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });

        setExportProgress(Math.round((i / frameCount) * 100));
        await new Promise(resolve => setTimeout(resolve, 50)); // Delay between downloads
      }

      setIsExporting(false);
      setExportProgress(0);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportAsImage = (format: 'png' | 'jpeg') => {
    const canvas = renderToCanvas(currentTime, 1920, 1080);
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `typography-${currentTime.toFixed(2)}s.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, `image/${format}`);
  };

  const exportAsSVG = () => {
    const width = 1920;
    const height = 1080;
    const style = currentStyle;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${width}" height="${height}" fill="#ffffff"/>`;
    
    const lines = text.split('\n');
    const lineHeightPx = style.fontSize * style.lineHeight;
    const totalHeight = lineHeightPx * lines.length;
    const startY = height / 2 - totalHeight / 2 + lineHeightPx / 2;

    lines.forEach((line, i) => {
      svg += `<text 
        x="${width / 2 + (style.positionX - 50) * 10}" 
        y="${startY + i * lineHeightPx + (style.positionY - 50) * 10}"
        font-family="${selectedFont}"
        font-size="${style.fontSize}"
        font-weight="${style.fontWeight}"
        fill="${style.color}"
        opacity="${style.opacity}"
        text-anchor="middle"
        letter-spacing="${style.letterSpacing}em"
        transform="rotate(${style.rotation}, ${width / 2}, ${height / 2}) scale(${style.scaleX}, ${style.scaleY})"
      >${line}</text>`;
    });

    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typography.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const exportData = {
      version: '1.0',
      text,
      font: selectedFont,
      duration,
      keyframes: keyframes.map(kf => ({
        time: kf.time,
        properties: kf.properties
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typography-animation.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSS = () => {
    let css = `/* Typography Animation - Generated from Type Playground */\n\n`;
    css += `@keyframes typographyAnimation {\n`;
    
    keyframes.forEach(kf => {
      const percentage = (kf.time / duration) * 100;
      css += `  ${percentage.toFixed(2)}% {\n`;
      if (kf.properties.fontSize) css += `    font-size: ${kf.properties.fontSize}px;\n`;
      if (kf.properties.fontWeight) css += `    font-weight: ${kf.properties.fontWeight};\n`;
      if (kf.properties.letterSpacing !== undefined) css += `    letter-spacing: ${kf.properties.letterSpacing}em;\n`;
      if (kf.properties.lineHeight) css += `    line-height: ${kf.properties.lineHeight};\n`;
      if (kf.properties.color) css += `    color: ${kf.properties.color};\n`;
      if (kf.properties.opacity !== undefined) css += `    opacity: ${kf.properties.opacity};\n`;
      if (kf.properties.rotation !== undefined || kf.properties.scaleX !== undefined || kf.properties.scaleY !== undefined) {
        css += `    transform: rotate(${kf.properties.rotation || 0}deg) scale(${kf.properties.scaleX || 1}, ${kf.properties.scaleY || 1});\n`;
      }
      css += `  }\n`;
    });
    
    css += `}\n\n`;
    css += `.typography-animated {\n`;
    css += `  font-family: '${selectedFont}';\n`;
    css += `  animation: typographyAnimation ${duration}s ease-in-out infinite;\n`;
    css += `}\n`;

    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typography-animation.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Particle System Functions
  const generateParticlesFromText = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    canvas.width = 1200;
    canvas.height = 400;
    
    ctx.fillStyle = '#000000';
    ctx.font = `${currentStyle.fontWeight} ${currentStyle.fontSize * 2}px ${selectedFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newParticles: Particle[] = [];
    
    const step = Math.max(1, Math.floor(6 / particleDensity));
    
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4;
        const alpha = imageData.data[index + 3];
        
        if (alpha > 128) {
          newParticles.push({
            x: (x / canvas.width) * 100,
            y: (y / canvas.height) * 100,
            targetX: (x / canvas.width) * 100,
            targetY: (y / canvas.height) * 100,
            vx: (Math.random() - 0.5) * particleChaos * 2,
            vy: (Math.random() - 0.5) * particleChaos * 2,
            size: particleSize,
            opacity: 1
          });
        }
      }
    }
    
    return newParticles;
  };

  const updateParticles = (particles: Particle[], mode: ParticleMode, time: number): Particle[] => {
    return particles.map((p, i) => {
      let newX = p.x;
      let newY = p.y;
      let newVx = p.vx;
      let newVy = p.vy;

      switch (mode) {
        case 'disperse':
          newVx += (Math.random() - 0.5) * 0.5 * particleSpeed;
          newVy += (Math.random() - 0.5) * 0.5 * particleSpeed;
          newX += newVx * particleSpeed;
          newY += newVy * particleSpeed;
          newVx *= 0.95;
          newVy *= 0.95;
          break;

        case 'swirl':
          const centerX = 50;
          const centerY = 50;
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const angle = Math.atan2(dy, dx);
          const radius = Math.sqrt(dx * dx + dy * dy);
          const newAngle = angle + 0.02 * particleSpeed;
          newX = centerX + Math.cos(newAngle) * radius;
          newY = centerY + Math.sin(newAngle) * radius;
          break;

        case 'wave':
          const wave = Math.sin((p.targetX / 10) + time * particleSpeed * 0.1) * 5;
          newY = p.targetY + wave;
          newX = p.targetX + Math.sin(time * particleSpeed * 0.05 + i * 0.1) * 2;
          break;

        case 'glitch':
          if (Math.random() < 0.05 * particleSpeed) {
            newX = p.targetX + (Math.random() - 0.5) * 20 * particleChaos;
            newY = p.targetY + (Math.random() - 0.5) * 20 * particleChaos;
          } else {
            newX += (p.targetX - p.x) * 0.1;
            newY += (p.targetY - p.y) * 0.1;
          }
          break;

        case 'orbit':
          const orbitAngle = (time * particleSpeed * 0.05) + (i * 0.05);
          const orbitRadius = 5 + Math.sin(time * 0.02 + i * 0.1) * 3;
          newX = p.targetX + Math.cos(orbitAngle) * orbitRadius;
          newY = p.targetY + Math.sin(orbitAngle) * orbitRadius;
          break;

        case 'normal':
        default:
          newX += (p.targetX - p.x) * 0.05 * particleSpeed;
          newY += (p.targetY - p.y) * 0.05 * particleSpeed;
          newVx *= 0.9;
          newVy *= 0.9;
          break;
      }

      return {
        ...p,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy
      };
    });
  };

  // Generate particles when text or settings change
  useEffect(() => {
    if (enableParticles) {
      const newParticles = generateParticlesFromText();
      setParticles(newParticles);
    }
  }, [text, selectedFont, currentStyle.fontSize, currentStyle.fontWeight, particleDensity, particleSize, enableParticles]);

  // Particle animation loop
  useEffect(() => {
    if (!enableParticles) {
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current);
      }
      return;
    }

    let time = 0;
    const animate = () => {
      time += 0.1;
      setParticles(prevParticles => updateParticles(prevParticles, particleMode, time));
      particleAnimationRef.current = requestAnimationFrame(animate);
    };

    particleAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current);
      }
    };
  }, [enableParticles, particleMode, particleSpeed, particleChaos]);

  // Render particles to canvas
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas || !enableParticles) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      const x = (p.x / 100) * canvas.width;
      const y = (p.y / 100) * canvas.height;

      ctx.fillStyle = currentStyle.color;
      ctx.globalAlpha = p.opacity * currentStyle.opacity;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }, [particles, enableParticles, currentStyle.color, currentStyle.opacity]);

  // Render hover glow mode to canvas
  useEffect(() => {
    const canvas = experimentCanvasRef.current;
    if (!canvas || !hoverGlowMode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const drawGlowText = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create glow effect
      const gradient = ctx.createRadialGradient(
        cursorPos.x, cursorPos.y, 0,
        cursorPos.x, cursorPos.y, glowRadius
      );
      gradient.addColorStop(0, `${glowColor}${Math.round(glowIntensity * 2.55).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'destination-over';
      
      // Draw text
      ctx.font = `${currentStyle.fontWeight} ${currentStyle.fontSize}px ${selectedFont}`;
      ctx.fillStyle = currentStyle.color;
      ctx.globalAlpha = currentStyle.opacity / 100;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const lines = text.split('\n');
      const lineHeight = currentStyle.fontSize * (currentStyle.lineHeight || 1.2);
      const totalHeight = lineHeight * (lines.length - 1);
      
      lines.forEach((line, index) => {
        const y = canvas.height / 2 + index * lineHeight - totalHeight / 2 + (currentStyle.positionY - 50) * 10;
        ctx.save();
        ctx.translate(canvas.width / 2 + (currentStyle.positionX - 50) * 10, y);
        ctx.rotate((currentStyle.rotation * Math.PI) / 180);
        ctx.scale(currentStyle.scaleX || 1, currentStyle.scaleY || 1);
        ctx.fillText(line, 0, 0);
        ctx.restore();
      });
      
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    drawGlowText();
  }, [text, selectedFont, currentStyle, hoverGlowMode, glowIntensity, glowRadius, glowColor, cursorPos]);

  // Render grid dot mode to canvas
  useEffect(() => {
    const canvas = gridDotCanvasRef.current;
    if (!canvas || !gridDotMode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size with device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid dots in background
    ctx.fillStyle = themeMode === 'error' ? 'rgba(0, 0, 0, 0.1)' : 
                    themeMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 
                    'rgba(0, 0, 0, 0.05)';
    for (let x = gridSize; x < rect.width; x += gridSize) {
      for (let y = gridSize; y < rect.height; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const lines = text.split('\n');
    const lineHeight = currentStyle.fontSize * (currentStyle.lineHeight || 1.2);
    const totalHeight = lineHeight * (lines.length - 1);

    // Create a temporary canvas for the text mask at higher resolution
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rect.width * 2;
    tempCanvas.height = rect.height * 2;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.scale(2, 2);
    tempCtx.font = `${currentStyle.fontWeight} ${currentStyle.fontSize}px "${selectedFont}"`;
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillStyle = 'white';

    lines.forEach((line, index) => {
      const y = rect.height / 2 + index * lineHeight - totalHeight / 2 + (currentStyle.positionY - 50) * 10;
      tempCtx.save();
      tempCtx.translate(rect.width / 2 + (currentStyle.positionX - 50) * 10, y);
      tempCtx.rotate((currentStyle.rotation * Math.PI) / 180);
      tempCtx.scale(currentStyle.scaleX || 1, currentStyle.scaleY || 1);
      tempCtx.fillText(line, 0, 0);
      tempCtx.restore();
    });

    // Draw dots only where text exists
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.fillStyle = currentStyle.color;
    ctx.globalAlpha = currentStyle.opacity / 100;

    for (let x = gridSize; x < rect.width; x += gridSize) {
      for (let y = gridSize; y < rect.height; y += gridSize) {
        // Sample multiple points around the grid position for better detection
        let hasText = false;
        const sampleRadius = gridSize / 2;
        
        for (let dx = -sampleRadius; dx <= sampleRadius; dx += 2) {
          for (let dy = -sampleRadius; dy <= sampleRadius; dy += 2) {
            const sampleX = Math.floor((x + dx) * 2);
            const sampleY = Math.floor((y + dy) * 2);
            const pixelIndex = (sampleY * tempCanvas.width + sampleX) * 4;
            const alpha = imageData.data[pixelIndex + 3];
            
            if (alpha > 50) {
              hasText = true;
              break;
            }
          }
          if (hasText) break;
        }
        
        if (hasText) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.globalAlpha = 1;
  }, [text, selectedFont, currentStyle, gridDotMode, gridSize, dotSize, themeMode]);

  // Render experiment mode to canvas
  useEffect(() => {
    const canvas = experimentCanvasRef.current;
    if (!canvas || !experimentMode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const drawExperimentText = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${currentStyle.fontWeight} ${currentStyle.fontSize}px ${selectedFont}`;
      ctx.fillStyle = currentStyle.color;
      ctx.globalAlpha = currentStyle.opacity / 100;
      ctx.textBaseline = 'middle';

      const lines = text.split('\n');
      const lineHeight = currentStyle.fontSize * (currentStyle.lineHeight || 1.2);
      const totalHeight = lineHeight * (lines.length - 1);
      
      lines.forEach((line, lineIndex) => {
        const y = canvas.height / 2 + lineIndex * lineHeight - totalHeight / 2 + (currentStyle.positionY - 50) * 10;
        const chars = line.split('');
        
        // Measure total width to center the line
        const totalWidth = ctx.measureText(line).width + (chars.length - 1) * (currentStyle.letterSpacing || 0) * currentStyle.fontSize / 10;
        let currentX = canvas.width / 2 - totalWidth / 2 + (currentStyle.positionX - 50) * 10;
        
        chars.forEach((char) => {
          const charWidth = ctx.measureText(char).width;
          const charCenterX = currentX + charWidth / 2;
          const charCenterY = y;
          
          // Calculate distance from cursor
          const dx = cursorPos.x - charCenterX;
          const dy = cursorPos.y - charCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate effect strength based on distance
          const strength = Math.max(0, 1 - distance / experimentRadius);
          const effectAmount = strength * (experimentIntensity / 100);
          
          ctx.save();
          ctx.translate(charCenterX, charCenterY);
          
          // Apply parametric transformation based on experiment type
          switch (experimentType) {
            case 'rotate':
              const rotateAngle = effectAmount * Math.PI * 0.5;
              ctx.rotate(rotateAngle);
              break;
            case 'shift':
              const angle = Math.atan2(dy, dx);
              const shiftAmount = effectAmount * 50;
              ctx.translate(
                -Math.cos(angle) * shiftAmount,
                -Math.sin(angle) * shiftAmount
              );
              break;
            case 'scale':
              const scaleAmount = 1 + effectAmount * 0.8;
              ctx.scale(scaleAmount, scaleAmount);
              break;
            case 'skew':
              const skewAmount = effectAmount * 0.7;
              ctx.transform(1, skewAmount, skewAmount, 1, 0, 0);
              break;
          }
          
          // Apply global transformations
          ctx.rotate((currentStyle.rotation * Math.PI) / 180);
          ctx.scale(currentStyle.scaleX || 1, currentStyle.scaleY || 1);
          
          // Draw character
          ctx.textAlign = 'center';
          ctx.fillText(char, 0, 0);
          ctx.restore();
          
          currentX += charWidth + (currentStyle.letterSpacing || 0) * currentStyle.fontSize / 10;
        });
      });

      ctx.globalAlpha = 1;
    };

    drawExperimentText();
  }, [text, selectedFont, currentStyle, experimentMode, experimentIntensity, experimentRadius, experimentType, cursorPos]);

  return (
    <div className={`${styles.container} ${
      themeMode === 'light' ? styles.lightMode : 
      themeMode === 'dark' ? styles.darkMode : 
      styles.errorMode
    }`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={gamificationStyles.headerTop}>
            <h2>
              {themeMode === 'error' ? (
                <>
                  [TYPE_PLAYGROUND.EXE]<span className={styles.blinkingCursor}>_</span>
                </>
              ) : (
                'Type Playground'
              )}
            </h2>
            <button
              className={`${gamificationStyles.statsButton} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}
              onClick={() => setShowStats(!showStats)}
              title="View Stats & Achievements"
            >
              {themeMode === 'error' ? '[STATS]' : '📊'}
            </button>
          </div>
          
          {/* XP Bar */}
          <div className={`${gamificationStyles.xpBar} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
            <div className={`${gamificationStyles.xpBarFill} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`} style={{ width: `${(xp % 100)}%` }} />
            <span className={`${gamificationStyles.xpText} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
              {themeMode === 'error' ? `LVL ${level} | XP: ${xp % 100}/100` : `Level ${level} • ${xp % 100}/100 XP`}
            </span>
          </div>
          
          {combo > 1 && (
            <div className={`${gamificationStyles.comboIndicator} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
              {themeMode === 'error' ? `>>> COMBO x${combo} <<<` : `🔥 ${combo}x COMBO!`}
            </div>
          )}
          
          <div className={styles.themeToggleGroup}>
            <button
              className={`${styles.themeToggle} ${themeMode === 'light' ? styles.activeTheme : ''}`}
              onClick={() => {
                setThemeMode('light');
                setStats(prev => ({ ...prev, themeSwitches: prev.themeSwitches + 1 }));
                addXP(5, 'Switched theme');
                increaseCombo();
              }}
              title="Light Mode"
            >
              {themeMode === 'error' ? '[L]' : '☀️'}
            </button>
            <button
              className={`${styles.themeToggle} ${themeMode === 'dark' ? styles.activeTheme : ''}`}
              onClick={() => {
                setThemeMode('dark');
                setStats(prev => ({ ...prev, themeSwitches: prev.themeSwitches + 1 }));
                addXP(5, 'Switched theme');
                increaseCombo();
              }}
              title="Dark Mode"
            >
              {themeMode === 'error' ? '[D]' : '🌙'}
            </button>
            <button
              className={`${styles.themeToggle} ${themeMode === 'error' ? styles.activeTheme : ''}`}
              onClick={() => {
                setThemeMode('error');
                setStats(prev => ({ ...prev, themeSwitches: prev.themeSwitches + 1 }));
                addXP(5, 'Switched theme');
                increaseCombo();
              }}
              title="Error Pixel Mode"
            >
              {themeMode === 'error' ? '[E]' : '⚠️'}
            </button>
          </div>
        </div>
        
          {themeMode === 'error' && (
          <div className={styles.errorHeader}>
            <div className={styles.asciiDivider}>{'═'.repeat(40)}</div>
            <div className={styles.errorMessage}>
              &gt;&gt; SYSTEM_ERROR: TYPOGRAPHY_OVERFLOW
            </div>
            <div className={styles.asciiDivider}>{'═'.repeat(40)}</div>
          </div>
        )}
        
        {/* Stats Panel */}
        {showStats && (
          <div className={`${gamificationStyles.statsPanel} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
            <div className={`${gamificationStyles.statsPanelHeader} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
              <h3>{themeMode === 'error' ? '[PLAYER_STATS.DAT]' : '📊 Stats & Achievements'}</h3>
              <button onClick={() => setShowStats(false)} className={`${gamificationStyles.closeStats} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
                {themeMode === 'error' ? '[X]' : '✕'}
              </button>
            </div>
            
            <div className={`${gamificationStyles.statsSection} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
              <h4>{themeMode === 'error' ? '>>> STATS' : '📈 Statistics'}</h4>
              <div className={`${gamificationStyles.statItem} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>Fonts Used: {stats.fontsUsed}</div>
              <div className={`${gamificationStyles.statItem} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>Experiments: {stats.experimentsRun}</div>
              <div className={`${gamificationStyles.statItem} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>Particles Enabled: {stats.particlesEnabled}</div>
              <div className={`${gamificationStyles.statItem} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>Exports: {stats.exportsCompleted}</div>
              <div className={`${gamificationStyles.statItem} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>Keyframes: {stats.keyframesCreated}</div>
              <div className={`${gamificationStyles.statItem} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>Theme Switches: {stats.themeSwitches}</div>
            </div>
            
            <div className={`${gamificationStyles.statsSection} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
              <h4>{themeMode === 'error' ? '>>> ACHIEVEMENTS' : '🏆 Achievements'}</h4>
              <div className={gamificationStyles.achievementGrid}>
                {['Font Explorer', 'Font Master', 'Mad Scientist', 'Particle Pro', 'Export Expert', 'Keyframe King', 'Theme Hopper'].map(achievement => (
                  <div 
                    key={achievement}
                    className={`${gamificationStyles.achievementBadge} ${achievements.includes(achievement) ? gamificationStyles.unlocked : gamificationStyles.locked} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}
                  >
                    {achievements.includes(achievement) ? '🏆' : '🔒'} {achievement}
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`${gamificationStyles.statsSection} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>
              <h4>{themeMode === 'error' ? '>>> DAILY_QUEST' : '🎯 Daily Challenge'}</h4>
              <div className={`${gamificationStyles.dailyChallenge} ${themeMode === 'light' ? gamificationStyles.lightMode : themeMode === 'dark' ? gamificationStyles.darkMode : gamificationStyles.errorMode}`}>{dailyChallenge}</div>
            </div>
          </div>
        )}

        {/* Text Input */}
        <section className={styles.section}>
          <label className={styles.label}>
            {themeMode === 'error' ? '┌─ [INPUT_TEXT] ─┐' : 'Text'}
          </label>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />
          {themeMode === 'error' && <div className={styles.asciiBox}>└{'─'.repeat(38)}┘</div>}
        </section>

        {/* Font Selection */}
        <section className={styles.section}>
          <label className={styles.label}>Font Family</label>
          
          {/* Font Source Filter */}
          <div className={styles.fontSourceTabs}>
            <button
              className={`${styles.sourceTab} ${fontSource === 'all' ? styles.active : ''}`}
              onClick={() => setFontSource('all')}
            >
              All
            </button>
            <button
              className={`${styles.sourceTab} ${fontSource === 'google' ? styles.active : ''}`}
              onClick={() => setFontSource('google')}
            >
              Google
            </button>
            <button
              className={`${styles.sourceTab} ${fontSource === 'fontshare' ? styles.active : ''}`}
              onClick={() => setFontSource('fontshare')}
            >
              Fontshare
            </button>
          </div>

          {/* Upload Font Button */}
          <div className={styles.uploadFontContainer}>
            <input
              type="file"
              id="fontUpload"
              accept=".otf,.ttf"
              multiple
              onChange={handleFontUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="fontUpload" className={styles.uploadButton}>
              + Upload OTF/TTF
            </label>
          </div>

          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search fonts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.fontList}>
            {filteredFonts.map(font => (
              <button
                key={font.family}
                className={`${styles.fontButton} ${selectedFont === font.family ? styles.active : ''}`}
                onClick={() => {
                  if (selectedFont !== font.family) {
                    setStats(prev => ({ ...prev, fontsUsed: prev.fontsUsed + 1 }));
                    addXP(5, 'Changed font');
                    increaseCombo();
                  }
                  setSelectedFont(font.family);
                }}
                style={{ fontFamily: font.family }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', `50%`);
                  e.currentTarget.style.setProperty('--mouse-y', `50%`);
                }}
              >
                <span className={styles.fontName}>{font.family}</span>
                {font.source === 'custom' && <span className={styles.customBadge}>Custom</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Style Controls */}
        <section className={styles.section}>
          <label className={styles.label}>Typography</label>
          
          <div className={styles.control}>
            <span>Size: {Math.round(currentStyle.fontSize)}px</span>
            <input
              type="range"
              min="12"
              max="200"
              value={currentStyle.fontSize}
              onChange={(e) => setCurrentStyle({ ...currentStyle, fontSize: Number(e.target.value) })}
            />
          </div>

          <div className={styles.control}>
            <span>Weight: {currentStyle.fontWeight}</span>
            <input
              type="range"
              min="100"
              max="900"
              step="100"
              value={currentStyle.fontWeight}
              onChange={(e) => setCurrentStyle({ ...currentStyle, fontWeight: Number(e.target.value) })}
            />
          </div>

          <div className={styles.control}>
            <span>Letter Spacing: {currentStyle.letterSpacing.toFixed(2)}em</span>
            <input
              type="range"
              min="-0.1"
              max="0.5"
              step="0.01"
              value={currentStyle.letterSpacing}
              onChange={(e) => setCurrentStyle({ ...currentStyle, letterSpacing: Number(e.target.value) })}
            />
          </div>

          <div className={styles.control}>
            <span>Line Height: {currentStyle.lineHeight.toFixed(2)}</span>
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.1"
              value={currentStyle.lineHeight}
              onChange={(e) => setCurrentStyle({ ...currentStyle, lineHeight: Number(e.target.value) })}
            />
          </div>
        </section>

        {/* Transform Controls */}
        <section className={styles.section}>
          <label className={styles.label}>Transform</label>
          
          <div className={styles.control}>
            <span>Rotation: {Math.round(currentStyle.rotation)}°</span>
            <input
              type="range"
              min="-180"
              max="180"
              value={currentStyle.rotation}
              onChange={(e) => setCurrentStyle({ ...currentStyle, rotation: Number(e.target.value) })}
            />
          </div>

          <div className={styles.control}>
            <span>Scale X: {currentStyle.scaleX.toFixed(2)}</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={currentStyle.scaleX}
              onChange={(e) => setCurrentStyle({ ...currentStyle, scaleX: Number(e.target.value) })}
            />
          </div>

          <div className={styles.control}>
            <span>Scale Y: {currentStyle.scaleY.toFixed(2)}</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={currentStyle.scaleY}
              onChange={(e) => setCurrentStyle({ ...currentStyle, scaleY: Number(e.target.value) })}
            />
          </div>

          <div className={styles.control}>
            <span>Opacity: {Math.round(currentStyle.opacity * 100)}%</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={currentStyle.opacity}
              onChange={(e) => setCurrentStyle({ ...currentStyle, opacity: Number(e.target.value) })}
            />
          </div>
        </section>

        {/* Color */}
        <section className={styles.section}>
          <label className={styles.label}>Color</label>
          <input
            type="color"
            className={styles.colorInput}
            value={currentStyle.color}
            onChange={(e) => setCurrentStyle({ ...currentStyle, color: e.target.value })}
          />
        </section>

        {/* Features Section */}
        <section className={styles.section}>
          <button 
            className={styles.sectionHeader}
            onClick={() => setFeaturesExpanded(!featuresExpanded)}
          >
            <span className={styles.sectionTitle}>
              {featuresExpanded ? '▼' : '▶'} Features
            </span>
          </button>
          
          {featuresExpanded && (
            <div className={styles.featuresContent}>
              {/* Feature Checkboxes */}
              <div className={styles.featureCheckboxes}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={enableParticles}
                    onChange={(e) => {
                      setEnableParticles(e.target.checked);
                      if (e.target.checked) {
                        setHoverGlowMode(false);
                        setExperimentMode(false);
                        setGridDotMode(false);
                        setStats(prev => ({ ...prev, particlesEnabled: prev.particlesEnabled + 1 }));
                        addXP(10, 'Enabled Particles');
                        increaseCombo();
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Enable Particles</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={hoverGlowMode}
                    onChange={(e) => {
                      setHoverGlowMode(e.target.checked);
                      if (e.target.checked) {
                        setEnableParticles(false);
                        setExperimentMode(false);
                        setGridDotMode(false);
                        setStats(prev => ({ ...prev, experimentsRun: prev.experimentsRun + 1 }));
                        addXP(10, 'Enabled Hover Glow');
                        increaseCombo();
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Enable Hover Glow</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={experimentMode}
                    onChange={(e) => {
                      setExperimentMode(e.target.checked);
                      if (e.target.checked) {
                        setEnableParticles(false);
                        setHoverGlowMode(false);
                        setGridDotMode(false);
                        setStats(prev => ({ ...prev, experimentsRun: prev.experimentsRun + 1 }));
                        addXP(10, 'Enabled Typography Experiment');
                        increaseCombo();
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Enable Typographic Experiment</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={gridDotMode}
                    onChange={(e) => {
                      setGridDotMode(e.target.checked);
                      if (e.target.checked) {
                        setEnableParticles(false);
                        setHoverGlowMode(false);
                        setExperimentMode(false);
                        setStats(prev => ({ ...prev, experimentsRun: prev.experimentsRun + 1 }));
                        addXP(10, 'Enabled Grid Dot Mode');
                        increaseCombo();
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span>Enable Grid Dot Typography</span>
                </label>
              </div>

              {/* Creature Mode & Glitch Mode Buttons */}
              <div className={styles.featureButtons}>
                <button
                  className={`${styles.featureButton} ${creatureMode ? styles.featureButtonActive : ''}`}
                  onClick={() => {
                    setCreatureMode(!creatureMode);
                    if (!creatureMode) {
                      addCreatureMessage('>> TYPE_CREATURE_AWAKENED');
                      addXP(10, 'Activated Creature Mode');
                      increaseCombo();
                    } else {
                      addCreatureMessage('>> TYPE_CREATURE_SLEEPING');
                    }
                  }}
                >
                  {themeMode === 'error' ? '[ > FEED_TYPE_CREATURE ]' : '🦎 Feed Type Creature'}
                </button>

                <button
                  className={`${styles.featureButton} ${glitchMode ? styles.featureButtonActive : ''}`}
                  onClick={() => {
                    setGlitchMode(!glitchMode);
                    if (!glitchMode) {
                      addCreatureMessage('>> GLITCH_MODE_ENABLED');
                      addXP(10, 'Enabled Glitch Mode');
                    } else {
                      resetGlitch();
                      addCreatureMessage('>> GLITCH_MODE_DISABLED');
                    }
                  }}
                >
                  {themeMode === 'error' ? '[ > ENTER_GLITCH_MODE ]' : '⚡ Enter Glitch Mode'}
                </button>

                {glitchMode && !glitchActive && (
                  <button
                    className={styles.activateGlitchButton}
                    onClick={activateGlitch}
                  >
                    {themeMode === 'error' ? '[ TRIGGER_CORRUPTION ]' : '💥 Trigger Glitch'}
                  </button>
                )}

                {glitchActive && (
                  <div className={styles.glitchTimer}>
                    {themeMode === 'error' ? `>> TIME_REMAINING: ${glitchTimer}s` : `⏱️ ${glitchTimer}s`}
                  </div>
                )}
              </div>

              {/* Creature Mood Meter */}
              {creatureMode && (
                <div className={styles.creatureMoodMeter}>
                  <div className={styles.moodLabel}>
                    {themeMode === 'error' ? '>> CREATURE_MOOD:' : '💚 Creature Mood:'}
                  </div>
                  <div className={styles.moodBar}>
                    <div 
                      className={styles.moodBarFill} 
                      style={{ 
                        width: `${creatureMood}%`,
                        backgroundColor: creatureMood > 60 ? '#00ff00' : creatureMood > 30 ? '#ffff00' : '#ff0000'
                      }}
                    />
                  </div>
                  <div className={styles.moodValue}>{creatureMood}%</div>
                </div>
              )}

              {/* Creature Messages Console */}
              {creatureMessages.length > 0 && (
                <div className={styles.creatureConsole}>
                  {creatureMessages.map((msg, i) => (
                    <div key={i} className={styles.consoleMessage}>
                      {msg}
                    </div>
                  ))}
                </div>
              )}

              {/* Particle Controls */}
              {enableParticles && (
                <div className={styles.featureControls}>
                  <div className={styles.control}>
                    <span>Mode</span>
                    <select
                      className={styles.select}
                      value={particleMode}
                      onChange={(e) => setParticleMode(e.target.value as ParticleMode)}
                    >
                      <option value="normal">Reform</option>
                      <option value="disperse">Disperse</option>
                      <option value="swirl">Swirl</option>
                      <option value="wave">Wave</option>
                      <option value="glitch">Glitch</option>
                      <option value="orbit">Orbit</option>
                    </select>
                  </div>

                  <div className={styles.control}>
                    <span>Density: {particleDensity.toFixed(1)}</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={particleDensity}
                      onChange={(e) => setParticleDensity(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.control}>
                    <span>Speed: {particleSpeed.toFixed(1)}</span>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={particleSpeed}
                      onChange={(e) => setParticleSpeed(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.control}>
                    <span>Particle Size: {particleSize.toFixed(1)}</span>
                    <input
                      type="range"
                      min="0.5"
                      max="8"
                      step="0.5"
                      value={particleSize}
                      onChange={(e) => setParticleSize(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.control}>
                    <span>Chaos: {particleChaos.toFixed(2)}</span>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={particleChaos}
                      onChange={(e) => setParticleChaos(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {/* Hover Glow Controls */}
              {hoverGlowMode && (
                <div className={styles.featureControls}>
                  <div className={styles.control}>
                    <span>Glow Intensity: {glowIntensity}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glowIntensity}
                      onChange={(e) => setGlowIntensity(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  <div className={styles.control}>
                    <span>Glow Radius: {glowRadius}px</span>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={glowRadius}
                      onChange={(e) => setGlowRadius(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  <div className={styles.control}>
                    <span>Glow Color</span>
                    <input
                      type="color"
                      value={glowColor}
                      onChange={(e) => setGlowColor(e.target.value)}
                      className={styles.colorInput}
                    />
                  </div>
                </div>
              )}

              {/* Typographic Experiment Controls */}
              {experimentMode && (
                <div className={styles.featureControls}>
                  <div className={styles.control}>
                    <label className={styles.controlLabel}>Effect Type</label>
                    <select
                      className={styles.select}
                      value={experimentType}
                      onChange={(e) => setExperimentType(e.target.value as 'rotate' | 'shift' | 'scale' | 'skew')}
                    >
                      <option value="rotate">Rotate</option>
                      <option value="shift">Shift Away</option>
                      <option value="scale">Scale</option>
                      <option value="skew">Skew</option>
                    </select>
                  </div>

                  <div className={styles.control}>
                    <span>Intensity: {experimentIntensity}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={experimentIntensity}
                      onChange={(e) => setExperimentIntensity(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  <div className={styles.control}>
                    <span>Radius: {experimentRadius}px</span>
                    <input
                      type="range"
                      min="50"
                      max="400"
                      value={experimentRadius}
                      onChange={(e) => setExperimentRadius(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>
                </div>
              )}

              {/* Grid Dot Controls */}
              {gridDotMode && (
                <div className={styles.featureControls}>
                  <div className={styles.control}>
                    <span>Grid Size: {gridSize}px</span>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={gridSize}
                      onChange={(e) => setGridSize(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  <div className={styles.control}>
                    <span>Dot Size: {dotSize}px</span>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      value={dotSize}
                      onChange={(e) => setDotSize(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Export */}
        <section className={styles.section}>
          <label className={styles.label}>Export</label>
          
          {isExporting && (
            <div className={styles.exportProgress}>
              <div className={styles.progressBar} style={{ width: `${exportProgress}%` }} />
              <span>{exportProgress}%</span>
            </div>
          )}

          <div className={styles.exportGroup}>
            <span className={styles.exportLabel}>Video</span>
            {!videoSupported && (
              <p className={styles.warningText}>Video export not supported in this browser. Use PNG Sequence instead.</p>
            )}
            <button 
              className={styles.exportButton}
              onClick={() => exportAsVideo('webm')}
              disabled={isExporting || !videoSupported}
            >
              WebM
            </button>
            <button 
              className={styles.exportButton}
              onClick={() => exportAsVideo('mp4')}
              disabled={isExporting || !videoSupported}
            >
              MP4
            </button>
          </div>

          <div className={styles.exportGroup}>
            <span className={styles.exportLabel}>Image Sequence</span>
            <button 
              className={styles.exportButton}
              onClick={exportAsPNGSequence}
              disabled={isExporting}
            >
              PNG Seq
            </button>
            <button 
              className={styles.exportButton}
              onClick={exportAsGIF}
              disabled={isExporting}
            >
              GIF Info
            </button>
          </div>

          <div className={styles.exportGroup}>
            <span className={styles.exportLabel}>Current Frame</span>
            <button 
              className={styles.exportButton}
              onClick={() => exportAsImage('png')}
            >
              PNG
            </button>
            <button 
              className={styles.exportButton}
              onClick={() => exportAsImage('jpeg')}
            >
              JPEG
            </button>
            <button 
              className={styles.exportButton}
              onClick={exportAsSVG}
            >
              SVG
            </button>
          </div>

          <div className={styles.exportGroup}>
            <span className={styles.exportLabel}>Data</span>
            <button 
              className={styles.exportButton}
              onClick={exportAsJSON}
            >
              JSON
            </button>
            <button 
              className={styles.exportButton}
              onClick={exportAsCSS}
            >
              CSS
            </button>
          </div>
        </section>
      </aside>

      {/* Notifications */}
      <div className={gamificationStyles.notificationContainer}>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`${gamificationStyles.notification} ${gamificationStyles[notification.type]} ${themeMode === 'error' ? gamificationStyles.errorMode : ''}`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Main Area */}
      <main className={styles.main}>
        {/* Canvas */}
        <div className={styles.canvas}>
          {!enableParticles && !experimentMode && !hoverGlowMode && !gridDotMode && (
            <div
              ref={textPreviewRef}
              className={`${styles.textPreview} ${creatureMode ? styles.creatureText : ''} ${glitchActive ? styles.glitchText : ''}`}
              style={{
                fontFamily: selectedFont,
                fontSize: `${currentStyle.fontSize}px`,
                fontWeight: currentStyle.fontWeight,
                letterSpacing: `${currentStyle.letterSpacing}em`,
                lineHeight: currentStyle.lineHeight,
                color: currentStyle.color,
                opacity: currentStyle.opacity,
                transform: `
                  translate(-50%, -50%)
                  translate(${(currentStyle.positionX - 50) * 10}px, ${(currentStyle.positionY - 50) * 10}px)
                  rotate(${currentStyle.rotation}deg)
                  scale(${currentStyle.scaleX}, ${currentStyle.scaleY})
                `,
                left: '50%',
                top: '50%',
                position: 'absolute',
                whiteSpace: 'pre-wrap',
                textAlign: 'center',
                textShadow: creatureMode ? `0 0 ${Math.sin(Date.now() / 500) * 10}px ${currentStyle.color}` : 'none',
                animation: glitchActive ? `${styles.glitchAnimation} 0.3s infinite` : 'none'
              }}
            >
              {glitchActive ? glitchedText : text}
            </div>
          )}
          
          {(experimentMode || hoverGlowMode) && (
            <canvas
              ref={experimentCanvasRef}
              className={styles.particleCanvas}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCursorPos({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top
                });
              }}
              onMouseLeave={() => {
                setCursorPos({ x: -9999, y: -9999 });
              }}
            />
          )}
          
          {gridDotMode && (
            <canvas
              ref={gridDotCanvasRef}
              className={styles.particleCanvas}
            />
          )}
          
          {enableParticles && (
            <canvas
              ref={particleCanvasRef}
              className={styles.particleCanvas}
            />
          )}
        </div>

        {/* Timeline Toggle Button */}
        {!showTimeline && (
          <button 
            className={styles.timelineToggle}
            onClick={() => setShowTimeline(true)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.setProperty('--mouse-x', `50%`);
              e.currentTarget.style.setProperty('--mouse-y', `50%`);
            }}
          >
            ▲ Show Timeline
          </button>
        )}

        {/* Timeline */}
        {showTimeline && (
          <div className={styles.timelineContainer}>
            <div className={styles.timelineHeader}>
              <h3>Timeline</h3>
              <div className={styles.playbackControls}>
              <button
                className={styles.controlButton}
                onClick={() => {
                  setCurrentTime(0);
                  updateStyleAtTime(0);
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', `50%`);
                  e.currentTarget.style.setProperty('--mouse-y', `50%`);
                }}
              >
                ⏮
              </button>
              <button
                className={styles.controlButton}
                onClick={() => setIsPlaying(!isPlaying)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', `50%`);
                  e.currentTarget.style.setProperty('--mouse-y', `50%`);
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                className={styles.controlButton}
                onClick={() => {
                  addKeyframe();
                  addCreatureMessage(`>> KEYFRAME_STORED [t=${currentTime.toFixed(2)}s]`);
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', `50%`);
                  e.currentTarget.style.setProperty('--mouse-y', `50%`);
                }}
              >
                {themeMode === 'error' ? '[ + KEYFRAME ]' : '+ Keyframe'}
              </button>
              <button
                className={`${styles.controlButton} ${timelineIsPlaying ? styles.controlButtonActive : ''}`}
                onClick={playTimeline}
                disabled={timelineIsPlaying}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', `50%`);
                  e.currentTarget.style.setProperty('--mouse-y', `50%`);
                }}
              >
                {themeMode === 'error' ? '[ ▶ PLAY ]' : '▶ Play'}
              </button>
              <button
                className={styles.controlButton}
                onClick={stopTimeline}
                disabled={!timelineIsPlaying}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--mouse-x', `50%`);
                  e.currentTarget.style.setProperty('--mouse-y', `50%`);
                }}
              >
                {themeMode === 'error' ? '[ ⏹ STOP ]' : '⏹ Stop'}
              </button>
              <div className={styles.timeDisplay}>
                {currentTime.toFixed(2)}s / {duration}s
              </div>
              {timelineIsPlaying && (
                <div className={styles.playbackProgressBar}>
                  <div 
                    className={styles.playbackProgressFill} 
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>
              )}
              <button
                className={styles.hideTimelineButton}
                onClick={() => setShowTimeline(false)}
                title="Hide Timeline"
              >
                ▼
              </button>
            </div>
          </div>

          <div className={styles.timeline} onClick={handleTimelineClick}>
            <div className={styles.timelineTrack}>
              <div
                className={styles.playhead}
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
              {keyframes.map(keyframe => (
                <div
                  key={keyframe.id}
                  className={styles.keyframe}
                  style={{ left: `${(keyframe.time / duration) * 100}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTime(keyframe.time);
                    updateStyleAtTime(keyframe.time);
                  }}
                >
                  <div className={styles.keyframeDiamond} />
                  {keyframe.time > 0 && (
                    <button
                      className={styles.deleteKeyframe}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteKeyframe(keyframe.id);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.keyframeList}>
            <h4>Keyframes</h4>
            {keyframes.sort((a, b) => a.time - b.time).map(keyframe => (
              <div key={keyframe.id} className={styles.keyframeItem}>
                <span>{keyframe.time.toFixed(2)}s</span>
                <button
                  onClick={() => {
                    setCurrentTime(keyframe.time);
                    updateStyleAtTime(keyframe.time);
                  }}
                >
                  Go to
                </button>
                {keyframe.time > 0 && (
                  <button onClick={() => deleteKeyframe(keyframe.id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
        </div>
        )}
      </main>
    </div>
  );
}

