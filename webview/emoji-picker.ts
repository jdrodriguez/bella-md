import { Editor } from '@tiptap/core';

export interface EmojiEntry { char: string; name: string }

export const EMOJI_CATEGORIES: { icon: string; name: string; emojis: EmojiEntry[] }[] = [
  {
    icon: '\u{1F600}', name: 'Smileys',
    emojis: [
      {char:'\u{1F600}',name:'grin grinning'},{char:'\u{1F603}',name:'smiley happy'},{char:'\u{1F604}',name:'smile happy'},{char:'\u{1F601}',name:'grin teeth'},{char:'\u{1F606}',name:'laugh squint'},{char:'\u{1F605}',name:'sweat smile'},{char:'\u{1F602}',name:'joy tears laugh cry'},{char:'\u{1F923}',name:'rofl rolling floor'},{char:'\u{1F60A}',name:'blush happy'},{char:'\u{1F607}',name:'angel halo innocent'},{char:'\u{1F642}',name:'smile slight'},{char:'\u{1F643}',name:'upside down'},{char:'\u{1F609}',name:'wink'},{char:'\u{1F60C}',name:'relieved'},{char:'\u{1F60D}',name:'heart eyes love'},{char:'\u{1F970}',name:'love hearts smiling'},{char:'\u{1F618}',name:'kiss blow'},{char:'\u{1F617}',name:'kiss'},{char:'\u{1F619}',name:'kiss smiling'},{char:'\u{1F61A}',name:'kiss closed'},{char:'\u{1F60B}',name:'yum delicious tongue'},{char:'\u{1F61B}',name:'tongue out'},{char:'\u{1F61C}',name:'wink tongue'},{char:'\u{1F92A}',name:'crazy zany wild'},{char:'\u{1F61D}',name:'tongue closed eyes'},{char:'\u{1F911}',name:'money mouth'},{char:'\u{1F917}',name:'hug hugging'},{char:'\u{1F92D}',name:'shy cover mouth'},{char:'\u{1F92B}',name:'shush quiet secret'},{char:'\u{1F914}',name:'think thinking hmm'},{char:'\u{1F910}',name:'zipper mouth quiet'},{char:'\u{1F928}',name:'raised eyebrow skeptic'},{char:'\u{1F610}',name:'neutral'},{char:'\u{1F611}',name:'expressionless'},{char:'\u{1F636}',name:'no mouth silent'},{char:'\u{1F60F}',name:'smirk'},{char:'\u{1F612}',name:'unamused'},{char:'\u{1F644}',name:'eye roll'},{char:'\u{1F62C}',name:'grimace awkward'},{char:'\u{1F925}',name:'lie liar pinocchio'},{char:'\u{1F60E}',name:'cool sunglasses'},{char:'\u{1F913}',name:'nerd glasses geek'},{char:'\u{1F9D0}',name:'monocle curious'},{char:'\u{1F615}',name:'confused'},{char:'\u{1F61F}',name:'worried'},{char:'\u{1F641}',name:'frown slight sad'},{char:'\u{2639}',name:'frown sad'},{char:'\u{1F62E}',name:'open mouth surprise'},{char:'\u{1F62F}',name:'hushed'},{char:'\u{1F632}',name:'astonished'},{char:'\u{1F633}',name:'flushed embarrassed'},{char:'\u{1F97A}',name:'pleading puppy eyes please'},{char:'\u{1F626}',name:'frown open mouth'},{char:'\u{1F627}',name:'anguished'},{char:'\u{1F628}',name:'fearful scared'},{char:'\u{1F630}',name:'cold sweat anxious'},{char:'\u{1F625}',name:'disappointed relieved'},{char:'\u{1F622}',name:'cry sad tear'},{char:'\u{1F62D}',name:'sob crying loud'},{char:'\u{1F631}',name:'scream scared horror'},{char:'\u{1F616}',name:'confounded'},{char:'\u{1F623}',name:'persevere'},{char:'\u{1F61E}',name:'disappointed sad'},{char:'\u{1F613}',name:'sweat'},{char:'\u{1F629}',name:'weary tired'},{char:'\u{1F624}',name:'triumph huff'},{char:'\u{1F620}',name:'angry mad'},{char:'\u{1F621}',name:'rage furious'},{char:'\u{1F92C}',name:'cursing swear angry'},{char:'\u{1F525}',name:'fire hot flame lit'},{char:'\u{1F4AF}',name:'hundred perfect score'},{char:'\u{2B50}',name:'star'},{char:'\u{1F31F}',name:'glowing star sparkle'},{char:'\u{1F4A5}',name:'boom explosion'},{char:'\u{1F4A2}',name:'anger symbol'},{char:'\u{1F4AB}',name:'dizzy stars'},{char:'\u{1F4A6}',name:'sweat droplets splash'},{char:'\u{1F4A8}',name:'dash wind fast'},{char:'\u{1F4AC}',name:'speech bubble talk chat'},{char:'\u{1F5E8}',name:'comment speech left'},
    ],
  },
  {
    icon: '\u{1F44D}', name: 'Gestures',
    emojis: [
      {char:'\u{1F44D}',name:'thumbs up like good yes'},{char:'\u{1F44E}',name:'thumbs down dislike bad no'},{char:'\u{1F44A}',name:'fist bump punch'},{char:'\u{270A}',name:'raised fist'},{char:'\u{1F91B}',name:'left fist'},{char:'\u{1F91C}',name:'right fist'},{char:'\u{1F44F}',name:'clap hands applause'},{char:'\u{1F64C}',name:'raised hands celebrate praise'},{char:'\u{1F450}',name:'open hands'},{char:'\u{1F932}',name:'palms up together'},{char:'\u{1F91D}',name:'handshake deal agreement'},{char:'\u{1F64F}',name:'pray please thanks folded hands'},{char:'\u{270D}',name:'writing hand'},{char:'\u{1F485}',name:'nail polish'},{char:'\u{1F933}',name:'selfie'},{char:'\u{1F4AA}',name:'muscle strong bicep flex'},{char:'\u{1F9BE}',name:'mechanical arm'},{char:'\u{1F9BF}',name:'mechanical leg'},{char:'\u{1F448}',name:'point left'},{char:'\u{1F449}',name:'point right'},{char:'\u{261D}',name:'point up'},{char:'\u{1F446}',name:'point up'},{char:'\u{1F595}',name:'middle finger'},{char:'\u{1F447}',name:'point down'},{char:'\u{270C}',name:'victory peace sign'},{char:'\u{1F91E}',name:'crossed fingers luck hope'},{char:'\u{1F596}',name:'vulcan spock'},{char:'\u{1F918}',name:'rock on horns metal'},{char:'\u{1F919}',name:'call me shaka hang loose'},{char:'\u{1F590}',name:'hand fingers splayed'},{char:'\u{270B}',name:'raised hand stop high five'},{char:'\u{1F44C}',name:'ok perfect'},{char:'\u{1F90C}',name:'pinched fingers italian'},{char:'\u{1F90F}',name:'pinch small'},{char:'\u{1F44B}',name:'wave hello goodbye'},{char:'\u{1F91A}',name:'raised back hand'},{char:'\u{1F9E1}',name:'orange heart love'},{char:'\u{1F49B}',name:'yellow heart love'},{char:'\u{1F49A}',name:'green heart love'},{char:'\u{1F499}',name:'blue heart love'},{char:'\u{1F49C}',name:'purple heart love'},{char:'\u{1F5A4}',name:'black heart love'},{char:'\u{1F90E}',name:'brown heart love'},{char:'\u{1F90D}',name:'white heart love'},{char:'\u{2764}',name:'red heart love'},{char:'\u{1F494}',name:'broken heart'},{char:'\u{1F495}',name:'two hearts love'},{char:'\u{1F49E}',name:'revolving hearts love'},{char:'\u{1F493}',name:'beating heart love'},{char:'\u{1F497}',name:'growing heart love'},{char:'\u{1F496}',name:'sparkling heart love'},{char:'\u{1F498}',name:'cupid heart arrow love'},{char:'\u{1F49D}',name:'gift heart ribbon love'},{char:'\u{1F49F}',name:'heart decoration love'},{char:'\u{1F48C}',name:'love letter envelope'},
    ],
  },
  {
    icon: '\u{1F431}', name: 'Animals',
    emojis: [
      {char:'\u{1F436}',name:'dog puppy'},{char:'\u{1F431}',name:'cat kitten'},{char:'\u{1F42D}',name:'mouse'},{char:'\u{1F439}',name:'hamster'},{char:'\u{1F430}',name:'rabbit bunny'},{char:'\u{1F98A}',name:'fox'},{char:'\u{1F43B}',name:'bear'},{char:'\u{1F43C}',name:'panda'},{char:'\u{1F428}',name:'koala'},{char:'\u{1F42F}',name:'tiger'},{char:'\u{1F981}',name:'lion'},{char:'\u{1F42E}',name:'cow'},{char:'\u{1F437}',name:'pig'},{char:'\u{1F438}',name:'frog'},{char:'\u{1F435}',name:'monkey'},{char:'\u{1F649}',name:'monkey hear no evil'},{char:'\u{1F64A}',name:'monkey speak no evil'},{char:'\u{1F412}',name:'monkey'},{char:'\u{1F414}',name:'chicken'},{char:'\u{1F427}',name:'penguin'},{char:'\u{1F426}',name:'bird'},{char:'\u{1F985}',name:'eagle'},{char:'\u{1F986}',name:'duck'},{char:'\u{1F989}',name:'owl'},{char:'\u{1F987}',name:'bat'},{char:'\u{1F43A}',name:'wolf'},{char:'\u{1F417}',name:'boar pig'},{char:'\u{1F434}',name:'horse'},{char:'\u{1F984}',name:'unicorn'},{char:'\u{1F41D}',name:'bee honeybee'},{char:'\u{1F41B}',name:'bug caterpillar'},{char:'\u{1F98B}',name:'butterfly'},{char:'\u{1F40C}',name:'snail'},{char:'\u{1F41A}',name:'shell'},{char:'\u{1F41E}',name:'ladybug'},{char:'\u{1F41C}',name:'ant'},{char:'\u{1F997}',name:'cricket'},{char:'\u{1F577}',name:'spider'},{char:'\u{1F578}',name:'spider web'},{char:'\u{1F422}',name:'turtle tortoise'},{char:'\u{1F40D}',name:'snake'},{char:'\u{1F98E}',name:'lizard gecko'},{char:'\u{1F982}',name:'scorpion'},{char:'\u{1F980}',name:'crab'},{char:'\u{1F991}',name:'squid'},{char:'\u{1F419}',name:'octopus'},{char:'\u{1F420}',name:'tropical fish'},{char:'\u{1F41F}',name:'fish'},{char:'\u{1F421}',name:'blowfish puffer'},{char:'\u{1F42C}',name:'dolphin'},{char:'\u{1F433}',name:'whale'},{char:'\u{1F40B}',name:'whale'},{char:'\u{1F40A}',name:'crocodile alligator'},{char:'\u{1F406}',name:'leopard'},{char:'\u{1F405}',name:'tiger'},{char:'\u{1F403}',name:'water buffalo'},{char:'\u{1F402}',name:'ox bull'},
    ],
  },
  {
    icon: '\u{1F34E}', name: 'Food',
    emojis: [
      {char:'\u{1F34E}',name:'apple red'},{char:'\u{1F34F}',name:'apple green'},{char:'\u{1F350}',name:'pear'},{char:'\u{1F34A}',name:'orange tangerine'},{char:'\u{1F34B}',name:'lemon'},{char:'\u{1F34C}',name:'banana'},{char:'\u{1F349}',name:'watermelon'},{char:'\u{1F347}',name:'grapes'},{char:'\u{1F353}',name:'strawberry'},{char:'\u{1F348}',name:'melon'},{char:'\u{1F352}',name:'cherry cherries'},{char:'\u{1F351}',name:'peach'},{char:'\u{1F34D}',name:'pineapple'},{char:'\u{1F965}',name:'coconut'},{char:'\u{1F95D}',name:'kiwi'},{char:'\u{1F345}',name:'tomato'},{char:'\u{1F346}',name:'eggplant aubergine'},{char:'\u{1F951}',name:'avocado'},{char:'\u{1F966}',name:'broccoli'},{char:'\u{1F955}',name:'carrot'},{char:'\u{1F33D}',name:'corn'},{char:'\u{1F336}',name:'hot pepper chili'},{char:'\u{1F952}',name:'cucumber'},{char:'\u{1F96C}',name:'leafy green salad'},{char:'\u{1F96B}',name:'mango'},{char:'\u{1F344}',name:'mushroom'},{char:'\u{1F95C}',name:'peanuts nuts'},{char:'\u{1F330}',name:'chestnut'},{char:'\u{1F35E}',name:'bread'},{char:'\u{1F950}',name:'croissant'},{char:'\u{1F956}',name:'baguette french bread'},{char:'\u{1F968}',name:'pretzel'},{char:'\u{1F96F}',name:'bagel'},{char:'\u{1F9C0}',name:'cheese'},{char:'\u{1F95A}',name:'egg'},{char:'\u{1F373}',name:'cooking egg frying'},{char:'\u{1F953}',name:'bacon'},{char:'\u{1F969}',name:'steak meat cut'},{char:'\u{1F354}',name:'hamburger burger'},{char:'\u{1F35F}',name:'fries french fries'},{char:'\u{1F355}',name:'pizza'},{char:'\u{1F32D}',name:'hot dog'},{char:'\u{1F96A}',name:'sandwich'},{char:'\u{1F32E}',name:'taco'},{char:'\u{1F32F}',name:'burrito'},{char:'\u{1F959}',name:'wrap flatbread'},{char:'\u{1F9C6}',name:'falafel'},{char:'\u{1F957}',name:'salad green'},{char:'\u{1F958}',name:'paella shallow pan food'},{char:'\u{1F35D}',name:'spaghetti pasta'},{char:'\u{1F35C}',name:'ramen noodles soup'},{char:'\u{1F372}',name:'stew pot'},{char:'\u{1F35B}',name:'curry rice'},{char:'\u{1F363}',name:'sushi'},{char:'\u{1F371}',name:'bento box lunch'},
    ],
  },
  {
    icon: '\u{26BD}', name: 'Activities',
    emojis: [
      {char:'\u{26BD}',name:'soccer football'},{char:'\u{1F3C0}',name:'basketball'},{char:'\u{1F3C8}',name:'football american'},{char:'\u{26BE}',name:'baseball'},{char:'\u{1F94E}',name:'softball'},{char:'\u{1F3BE}',name:'tennis'},{char:'\u{1F3D0}',name:'volleyball'},{char:'\u{1F3C9}',name:'rugby'},{char:'\u{1F94F}',name:'frisbee disc'},{char:'\u{1F3B1}',name:'pool billiards'},{char:'\u{1F3D3}',name:'ping pong table tennis'},{char:'\u{1F3F8}',name:'badminton'},{char:'\u{1F3D2}',name:'hockey ice'},{char:'\u{1F94D}',name:'lacrosse'},{char:'\u{1F3D1}',name:'hockey field'},{char:'\u{1F94B}',name:'martial arts karate'},{char:'\u{1F3AF}',name:'bullseye target dart'},{char:'\u{26F3}',name:'golf'},{char:'\u{1F94A}',name:'boxing glove'},{char:'\u{1F945}',name:'goal net'},{char:'\u{26F8}',name:'ice skating'},{char:'\u{1F3A3}',name:'fishing'},{char:'\u{1F93F}',name:'diving mask snorkel'},{char:'\u{1F3BD}',name:'running shirt sport'},{char:'\u{1F3BF}',name:'skiing'},{char:'\u{1F6F7}',name:'sled'},{char:'\u{1F3AE}',name:'video game controller gaming'},{char:'\u{1F579}',name:'joystick'},{char:'\u{1F3B2}',name:'dice game'},{char:'\u{1F9E9}',name:'puzzle piece jigsaw'},{char:'\u{265F}',name:'chess'},{char:'\u{1F3AD}',name:'theater performing arts drama'},{char:'\u{1F3A8}',name:'art paint palette'},{char:'\u{1F3B5}',name:'music note'},{char:'\u{1F3B6}',name:'music notes'},{char:'\u{1F3A4}',name:'microphone karaoke sing'},{char:'\u{1F3A7}',name:'headphones music listen'},{char:'\u{1F3B7}',name:'saxophone sax'},{char:'\u{1F3B8}',name:'guitar'},{char:'\u{1F3B9}',name:'piano keyboard music'},{char:'\u{1F3BA}',name:'trumpet'},{char:'\u{1F3BB}',name:'violin'},{char:'\u{1F941}',name:'drum'},{char:'\u{1F3AC}',name:'movie film clapper'},{char:'\u{1F3F9}',name:'bow arrow archery'},
    ],
  },
  {
    icon: '\u{2708}', name: 'Travel',
    emojis: [
      {char:'\u{1F697}',name:'car automobile'},{char:'\u{1F695}',name:'taxi cab'},{char:'\u{1F699}',name:'suv truck'},{char:'\u{1F68C}',name:'bus'},{char:'\u{1F68E}',name:'trolley bus'},{char:'\u{1F3CE}',name:'race car racing'},{char:'\u{1F693}',name:'police car'},{char:'\u{1F691}',name:'ambulance'},{char:'\u{1F692}',name:'fire truck engine'},{char:'\u{1F6F5}',name:'scooter motor'},{char:'\u{1F3CD}',name:'motorcycle'},{char:'\u{1F6B2}',name:'bicycle bike'},{char:'\u{1F6E4}',name:'railway track train'},{char:'\u{1F6A2}',name:'ship cruise boat'},{char:'\u{26F5}',name:'sailboat'},{char:'\u{1F6A4}',name:'speedboat'},{char:'\u{2708}',name:'airplane plane flight'},{char:'\u{1F6EB}',name:'airplane departure takeoff'},{char:'\u{1F6EC}',name:'airplane arrival landing'},{char:'\u{1F681}',name:'helicopter'},{char:'\u{1F680}',name:'rocket launch space'},{char:'\u{1F6F8}',name:'ufo flying saucer alien'},{char:'\u{1F3E0}',name:'house home'},{char:'\u{1F3E2}',name:'office building'},{char:'\u{1F3D7}',name:'construction building'},{char:'\u{1F3ED}',name:'factory'},{char:'\u{1F3F0}',name:'castle'},{char:'\u{1F5FC}',name:'tokyo tower'},{char:'\u{1F5FD}',name:'statue liberty'},{char:'\u{26EA}',name:'church'},{char:'\u{1F54C}',name:'mosque'},{char:'\u{1F54D}',name:'synagogue'},{char:'\u{26E9}',name:'shinto shrine'},{char:'\u{1F54B}',name:'temple kaaba'},{char:'\u{26F2}',name:'fountain'},{char:'\u{26FA}',name:'tent camping'},{char:'\u{1F301}',name:'foggy'},{char:'\u{1F303}',name:'night stars city'},{char:'\u{1F304}',name:'sunrise mountains'},{char:'\u{1F305}',name:'sunrise'},{char:'\u{1F306}',name:'cityscape dusk'},{char:'\u{1F307}',name:'sunset city'},{char:'\u{1F309}',name:'bridge night'},{char:'\u{1F30C}',name:'milky way galaxy'},{char:'\u{1F386}',name:'fireworks'},{char:'\u{1F387}',name:'sparkler firework'},{char:'\u{1F30D}',name:'earth globe world'},{char:'\u{1F30E}',name:'earth americas globe world'},{char:'\u{1F30F}',name:'earth asia globe world'},
    ],
  },
  {
    icon: '\u{1F4A1}', name: 'Objects',
    emojis: [
      {char:'\u{231A}',name:'watch time'},{char:'\u{1F4F1}',name:'phone mobile cell'},{char:'\u{1F4BB}',name:'laptop computer'},{char:'\u{1F5A5}',name:'desktop computer screen'},{char:'\u{1F4BD}',name:'minidisc'},{char:'\u{1F4BE}',name:'floppy disk save'},{char:'\u{1F4BF}',name:'cd disc'},{char:'\u{1F4C0}',name:'dvd disc'},{char:'\u{1F4F7}',name:'camera photo'},{char:'\u{1F4F9}',name:'video camera'},{char:'\u{1F4FA}',name:'television tv'},{char:'\u{1F4FB}',name:'radio'},{char:'\u{1F4DE}',name:'telephone receiver phone'},{char:'\u{260E}',name:'telephone phone'},{char:'\u{1F50B}',name:'battery'},{char:'\u{1F50C}',name:'electric plug power'},{char:'\u{1F4A1}',name:'light bulb idea'},{char:'\u{1F526}',name:'flashlight torch'},{char:'\u{1F56F}',name:'candle'},{char:'\u{1F4B0}',name:'money bag'},{char:'\u{1F4B5}',name:'dollar money bill cash'},{char:'\u{1F4B3}',name:'credit card payment'},{char:'\u{1F48E}',name:'gem diamond jewel'},{char:'\u{2696}',name:'scales balance justice'},{char:'\u{1F9F0}',name:'toolbox tools'},{char:'\u{1F527}',name:'wrench tool'},{char:'\u{1F528}',name:'hammer tool'},{char:'\u{1F529}',name:'nut bolt screw'},{char:'\u{2699}',name:'gear settings cog'},{char:'\u{26D3}',name:'chain link'},{char:'\u{1F52B}',name:'water gun pistol'},{char:'\u{1F4E6}',name:'package box'},{char:'\u{1F4EE}',name:'postbox mailbox'},{char:'\u{1F4EB}',name:'mailbox'},{char:'\u{1F4EA}',name:'mailbox lowered'},{char:'\u{1F4EC}',name:'mailbox mail'},{char:'\u{1F4ED}',name:'mailbox empty'},{char:'\u{1F4E9}',name:'envelope arrow email'},{char:'\u{270F}',name:'pencil edit write'},{char:'\u{1F58A}',name:'pen ballpoint write'},{char:'\u{1F58B}',name:'fountain pen write'},{char:'\u{1F4DD}',name:'memo note write'},{char:'\u{1F4C1}',name:'folder file'},{char:'\u{1F4C2}',name:'folder open file'},{char:'\u{1F4CB}',name:'clipboard'},{char:'\u{1F4CC}',name:'pushpin pin'},{char:'\u{1F4CE}',name:'paperclip clip'},{char:'\u{1F4CF}',name:'ruler straight'},{char:'\u{1F4D0}',name:'ruler triangular'},{char:'\u{2702}',name:'scissors cut'},{char:'\u{1F512}',name:'lock locked'},{char:'\u{1F513}',name:'unlock unlocked'},{char:'\u{1F511}',name:'key'},{char:'\u{1F5DD}',name:'old key'},
    ],
  },
  {
    icon: '\u{2705}', name: 'Symbols',
    emojis: [
      {char:'\u{2705}',name:'check mark done yes'},{char:'\u{2714}',name:'check mark heavy done'},{char:'\u{274C}',name:'cross mark x no wrong'},{char:'\u{274E}',name:'cross mark x'},{char:'\u{2795}',name:'plus add'},{char:'\u{2796}',name:'minus subtract'},{char:'\u{2797}',name:'divide division'},{char:'\u{27B0}',name:'curly loop'},{char:'\u{27BF}',name:'double curly loop'},{char:'\u{2757}',name:'exclamation warning alert'},{char:'\u{2753}',name:'question mark'},{char:'\u{2049}',name:'exclamation question'},{char:'\u{203C}',name:'double exclamation'},{char:'\u{1F4B2}',name:'dollar sign money'},{char:'\u{1F4B1}',name:'currency exchange money'},{char:'\u{00A9}',name:'copyright'},{char:'\u{00AE}',name:'registered trademark'},{char:'\u{2122}',name:'trademark tm'},{char:'\u{1F51A}',name:'end arrow'},{char:'\u{1F519}',name:'back arrow'},{char:'\u{1F51B}',name:'on arrow'},{char:'\u{1F51D}',name:'top arrow'},{char:'\u{1F51C}',name:'soon arrow'},{char:'\u{1F518}',name:'radio button'},{char:'\u{26AA}',name:'white circle'},{char:'\u{26AB}',name:'black circle'},{char:'\u{1F534}',name:'red circle'},{char:'\u{1F535}',name:'blue circle'},{char:'\u{1F7E0}',name:'orange circle'},{char:'\u{1F7E1}',name:'yellow circle'},{char:'\u{1F7E2}',name:'green circle'},{char:'\u{1F7E3}',name:'purple circle'},{char:'\u{1F7E4}',name:'brown circle'},{char:'\u{25FC}',name:'black square medium'},{char:'\u{25FB}',name:'white square medium'},{char:'\u{25FE}',name:'black square small'},{char:'\u{25FD}',name:'white square small'},{char:'\u{25AA}',name:'black square'},{char:'\u{25AB}',name:'white square'},{char:'\u{1F536}',name:'orange diamond large'},{char:'\u{1F537}',name:'blue diamond large'},{char:'\u{1F538}',name:'orange diamond small'},{char:'\u{1F539}',name:'blue diamond small'},{char:'\u{1F53A}',name:'red triangle up'},{char:'\u{1F53B}',name:'red triangle down'},{char:'\u{2B06}',name:'arrow up'},{char:'\u{2B07}',name:'arrow down'},{char:'\u{27A1}',name:'arrow right'},{char:'\u{2B05}',name:'arrow left'},{char:'\u{2197}',name:'arrow up right'},{char:'\u{2198}',name:'arrow down right'},{char:'\u{2199}',name:'arrow down left'},{char:'\u{2196}',name:'arrow up left'},{char:'\u{2195}',name:'arrow up down'},{char:'\u{2194}',name:'arrow left right'},{char:'\u{21A9}',name:'arrow return left undo'},{char:'\u{21AA}',name:'arrow return right redo'},{char:'\u{1F504}',name:'arrows counterclockwise refresh'},{char:'\u{1F503}',name:'arrows clockwise cycle'},
    ],
  },
];

export function createEmojiPicker(editor: Editor): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'emoji-picker-wrapper';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.textContent = '\u{1F642}';
  trigger.title = 'Insert Emoji';
  trigger.setAttribute('aria-label', 'Insert Emoji');
  trigger.style.fontSize = '16px';

  const picker = document.createElement('div');
  picker.className = 'emoji-picker';

  // Search bar
  const searchWrap = document.createElement('div');
  searchWrap.className = 'emoji-picker-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search emoji...';
  searchWrap.appendChild(searchInput);
  picker.appendChild(searchWrap);

  // Category tabs
  const tabsBar = document.createElement('div');
  tabsBar.className = 'emoji-picker-tabs';
  const tabButtons: HTMLButtonElement[] = [];

  for (const cat of EMOJI_CATEGORIES) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.textContent = cat.icon;
    tab.title = cat.name;
    tabButtons.push(tab);
    tabsBar.appendChild(tab);
  }
  picker.appendChild(tabsBar);

  // Emoji grid
  const grid = document.createElement('div');
  grid.className = 'emoji-picker-grid';
  picker.appendChild(grid);

  let activeCategory = 0;

  function addEmojiButton(entry: EmojiEntry, clearSearch = false): void {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = entry.char;
    btn.title = entry.name;
    btn.addEventListener('mousedown', (ev) => ev.preventDefault());
    btn.addEventListener('click', () => {
      editor.chain().focus().insertContent(entry.char).run();
      picker.classList.remove('is-open');
      if (clearSearch) searchInput.value = '';
    });
    grid.appendChild(btn);
  }

  function renderCategory(index: number): void {
    activeCategory = index;
    grid.innerHTML = '';
    tabButtons.forEach((tb, i) => tb.classList.toggle('is-active', i === index));
    for (const entry of EMOJI_CATEGORIES[index].emojis) {
      addEmojiButton(entry);
    }
  }

  function renderSearch(query: string): void {
    grid.innerHTML = '';
    tabButtons.forEach((tb) => tb.classList.remove('is-active'));
    const q = query.toLowerCase();
    for (const cat of EMOJI_CATEGORIES) {
      for (const entry of cat.emojis) {
        if (entry.name.includes(q) || cat.name.toLowerCase().includes(q)) {
          addEmojiButton(entry, true);
        }
      }
    }
  }

  tabButtons.forEach((tb, i) => {
    tb.addEventListener('mousedown', (ev) => ev.preventDefault());
    tb.addEventListener('click', () => {
      searchInput.value = '';
      renderCategory(i);
    });
  });

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    if (q.length === 0) {
      renderCategory(activeCategory);
    } else {
      renderSearch(q);
    }
  });

  // Prevent search input from stealing editor focus issues
  searchInput.addEventListener('mousedown', (ev) => ev.stopPropagation());

  // Toggle picker
  trigger.addEventListener('mousedown', (ev) => ev.preventDefault());
  trigger.addEventListener('click', () => {
    const isOpen = picker.classList.toggle('is-open');
    if (isOpen) {
      renderCategory(0);
      setTimeout(() => searchInput.focus(), 0);
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (ev) => {
    if (!wrapper.contains(ev.target as Node)) {
      picker.classList.remove('is-open');
    }
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(picker);
  return wrapper;
}
