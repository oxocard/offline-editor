import * as monaco from 'monaco-editor';

const nanopyKeywords = [
  'const',
  'def',
  'class',
  'if',
  'elif',
  'else',
  'while',
  'for',
  'in',
  'return',
  'vector',
  'int',
  'long',
  'float',
  'bool',
  'byte',
  'true',
  'false',
  'import',
];

const nanopyConstants = [
  'PI',
  'PI_DIV2',
  'SCREEN_WIDTH',
  'SCREEN_HEIGHT',
  'FONT_ROBOTO_16',
  'FONT_ROBOTO_24',
  'FONT_ROBOTO_32',
  'FONT_ROBOTO_48',
  'FONT_ROBOTO_64',
  'FONT_ROBOTO_80',
  'FONT_ROBOTO_BOLD_16',
  'FONT_ROBOTO_BOLD_24',
  'FONT_ROBOTO_BOLD_32',
  'FONT_ROBOTO_BOLD_48',
  'FONT_ROBOTO_BOLD_64',
  'FONT_ROBOTO_BOLD_80',
  'SOUND_STARTUP',
  'SOUND_BLUB',
  'SOUND_CRASH',
  'SOUND_LEVEL',
  'SOUND_LOSE',
  'C_ACCEL_X',
  'C_ACCEL_Y',
  'C_ACCEL_Z',
  'C_TEMP',
  'C_HUMI',
  'C_PRES',
  'C_AMB_R',
  'C_AMB_G',
  'C_AMB_B',
  'C_AMB_IR',
  'C_AMB_LUX',
  'C_CO2',
  'C_IAQ',
  'C_TVOC',
  'C_ETOH',
  'C_MIC_AMP',
  'C_MIC_DEC',
  'C_MIC_FREQ',
  'C_HW_GALAXY',
  'C_HW_ARTWORK',
  'C_HW_SCIENCE',
  'C_HW_SCIENCE_PLUS',
  'C_HW_CONNECT',
  'C_PIN_01',
  'C_PIN_02',
  'C_PIN_03',
  'C_PIN_04',
  'C_PIN_05',
  'C_PIN_06',
  'C_PIN_07',
  'C_PIN_MISO',
  'C_PIN_MOSI',
  'C_PIN_SCK',
  'C_PIN_SDA',
  'C_PIN_SCL',
  'C_LED_TYPE_WS2812',
  'C_LED_TYPE_WS2812B',
  'C_LED_TYPE_WS2812B_MINI',
  'C_LED_TYPE_WS2813',
  'C_LED_TYPE_WS2814',
  'C_LED_TYPE_SK6812',
  'GLOBAL',
  'C_READ',
  'C_WRITE',
  'C_APPEND',
  'OUTPUT',
  'INPUT',
  'INPUT_PULLUP',
  'INPUT_PULLDOWN',
  'C_WAVEFORM_SQUARE',
  'C_WAVEFORM_SAWTOOTH',
  'C_WAVEFORM_TRIANGLE',
  'C_WAVEFORM_SINE',
  'C_WAVEFORM_RANDOM',
  'C_NOTE_REST',
  'C_NOTE_C',
  'C_NOTE_CS',
  'C_NOTE_D',
  'C_NOTE_DS',
  'C_NOTE_E',
  'C_NOTE_F',
  'C_NOTE_FS',
  'C_NOTE_G',
  'C_NOTE_GS',
  'C_NOTE_A',
  'C_NOTE_AS',
  'C_NOTE_B',
  'C_DURATION_1_1',
  'C_DURATION_1_2',
  'C_DURATION_1_4',
  'C_DURATION_1_8',
  'C_DURATION_1_16',
  'C_DURATION_1_32',
  'C_OCTAVE_C3',
  'C_OCTAVE_C4',
  'C_OCTAVE_C5',
  'C_OCTAVE_C6',
  'C_OCTAVE_C7',
  'C_OCTAVE_C8',
  'C_ARTICULATION_STANDARD',
  'C_ARTICULATION_STACCATO',
  'C_ARTICULATION_STACCATISSIMO',
  'C_ARTICULATION_TENUTO',
  'C_ARTICULATION_MARCATO',
  'C_ARTICULATION_LEGATO',
  'C_NOX',
];

const nanopyFunctions = [
  { name: 'sin', insertText: 'sin(${1:rad})', docLink: 'F000100' },
  { name: 'asin', insertText: 'asin(${1:rad})', docLink: 'F000110' },
  { name: 'cos', insertText: 'cos(${1:rad})', docLink: 'F000200' },
  { name: 'acos', insertText: 'acos(${1:rad})', docLink: 'F000210' },
  { name: 'tan', insertText: 'tan(${1:rad})', docLink: 'F000300' },
  { name: 'atan', insertText: 'atan(${1:rad})', docLink: 'F000310' },
  { name: 'avg', insertText: 'avg(${1:number1}, ${2:number2})', docLink: 'F000400' },
  { name: 'pow', insertText: 'pow(${1:a}, ${2:b})', docLink: 'F000450' },
  { name: 'sqrt', insertText: 'sqrt(${1:a})', docLink: 'F000500' },
  { name: 'min', insertText: 'min(${1:a}, ${2:b})', docLink: 'F000600' },
  { name: 'max', insertText: 'max(${1:a}, ${2:b})', docLink: 'F000700' },
  { name: 'ceil', insertText: 'ceil(${1:a})', docLink: 'F000800' },
  { name: 'floor', insertText: 'floor(${1:a})', docLink: 'F000900' },
  { name: 'lerp', insertText: 'lerp(${1:a}, ${2:b}, ${3:t})', docLink: 'F001000' },
  { name: 'abs', insertText: 'abs(${1:a})', docLink: 'F001100' },
  {
    name: 'map',
    insertText: 'map(${1:v}, ${2:start1}, ${3:stop1}, ${4:start2}, ${5:stop2})',
    docLink: 'F001200',
  },
  { name: 'exp', insertText: 'exp(${1:n})', docLink: 'F001300' },
  { name: 'log', insertText: 'log(${1:n})', docLink: 'F001400' },
  { name: 'round', insertText: 'round(${1:n})', docLink: 'F001500' },
  { name: 'randomSeed', insertText: 'randomSeed(${1:seed})', docLink: 'F001550' },
  { name: 'random', insertText: 'random(${1:min}, ${2:max})', docLink: 'F001600' },
  { name: 'rad', insertText: 'rad(${1:deg})', docLink: 'F001700' },
  { name: 'deg', insertText: 'deg(${1:rad})', docLink: 'F001800' },
  { name: 'toInt', insertText: 'toInt(${1:a})', docLink: 'F001850' },
  { name: 'toFloat', insertText: 'toFloat(${1:a})', docLink: 'F001900' },
  { name: 'delay', insertText: 'delay(${1:ms})', docLink: 'F003900' },
  { name: 'getButton', insertText: 'getButton()', docLink: 'F004000' },
  { name: 'getButtons', insertText: 'getButtons()', docLink: 'F004100' },
  { name: 'millis', insertText: 'millis()', docLink: 'F004200' },
  { name: 'update', insertText: 'update()', docLink: 'F004300' },
  { name: 'clear', insertText: 'clear()', docLink: 'F004350' },
  { name: 'background', insertText: 'background(${1:r}, ${2:g}, ${3:b})', docLink: 'F004400' },
  { name: 'stroke', insertText: 'stroke(${1:r}, ${2:g}, ${3:b})', docLink: 'F004500' },
  {
    name: 'strokeWeight',
    insertText: 'strokeWeight(${1:w})',
    docLink: 'F004600',
  },
  { name: 'noStroke', insertText: 'noStroke()', docLink: 'F004700' },
  { name: 'fill', insertText: 'fill(${1:r}, ${2:g}, ${3:b})', docLink: 'F004800' },
  { name: 'noFill', insertText: 'noFill()', docLink: 'F004900' },
  {
    name: 'drawLine',
    insertText: 'drawLine(${1:x0}, ${2:y0}, ${3:x1}, ${4:y1})',
    docLink: 'F005000',
  },
  {
    name: 'drawRectangle',
    insertText: 'drawRectangle(${1:x}, ${2:y}, ${3:w}, ${4:h})',
    docLink: 'F005100',
  },
  {
    name: 'drawTriangle',
    insertText: 'drawTriangle(${1:x0}, ${2:y0}, ${3:x1}, ${4:y1}, ${5:x2}, ${6:y2})',
    docLink: 'F005200',
  },
  {
    name: 'drawQuadrangle',
    insertText:
      'drawQuadrangle(${1:x0}, ${2:y0}, ${3:x1}, ${4:y1}, ${5:x2}, ${6:y2}, ${7:x3}, ${8:y3})',
    docLink: 'F005300',
  },
  { name: 'fillHSV', insertText: 'fillHSV(${1:h}, ${2:s}, ${3:v})', docLink: 'F005400' },
  {
    name: 'backgroundHSV',
    insertText: 'backgroundHSV(${1:h}, ${2:s}, ${3:v})',
    docLink: 'F005500',
  },
  { name: 'strokeHSV', insertText: 'strokeHSV(${1:h}, ${2:s}, ${3:v})', docLink: 'F005600' },
  { name: 'drawCircle', insertText: 'drawCircle(${1:x}, ${2:y}, ${3:r})', docLink: 'F005700' },
  {
    name: 'drawEllipse',
    insertText: 'drawEllipse(${1:x}, ${2:y}, ${3:r0}, ${4:r1})',
    docLink: 'F005800',
  },
  {
    name: 'drawArc',
    insertText: 'drawArc(${1:x}, ${2:y}, ${3:r}, ${4:start}, ${5:angle})',
    docLink: 'F005900',
  },
  { name: 'drawPixel', insertText: 'drawPixel(${1:x}, ${2:y})', docLink: 'F006000' },
  {
    name: 'drawSprite',
    insertText: 'drawSprite(${1:x}, ${2:y} , ${3:w} , ${4:h} , ${5:buf})',
    docLink: 'F006050',
  },
  {
    name: 'drawImageMono',
    insertText: 'drawImageMono(${1:x}, ${2:y}, ${3:w}, ${4:h}, ${5:buf})',
    docLink: 'F006100',
  },
  { name: 'drawIcon', insertText: 'drawIcon(${1:x}, ${2:y}, ${3:size}, ${4:id})' },
  {
    name: 'drawImageMonoCentered',
    insertText: 'drawImageMonoCentered(${1:x}, ${2:y}, ${3:w}, ${4:h}), ${5:img})',
    docLink: 'F006150',
  },
  {
    name: 'drawSprite24',
    insertText: 'drawSprite24(${1:x}, ${2:y}, ${3:rotationFactor}, ${4:scaleFactor}), ${5:img})',
    docLink: 'F006150',
  },
  {
    name: 'drawQRCode',
    insertText: 'drawQRCode(${1:x}, ${2:y}, ${3:pixelSize}, ${4:invert}, ${5:str})',
    docLink: 'F006200',
  },
  { name: 'beginShape', insertText: 'beginShape()', docLink: 'F006800' },
  { name: 'endShape', insertText: 'endShape(${1:closed})', docLink: 'F006900' },
  { name: 'addVertex', insertText: 'addVertex(${1:x}, ${2:y})', docLink: 'F007000' },
  { name: 'drawText', insertText: 'drawText(${1:x}, ${2:y}, ${3:text})', docLink: 'F006300' },
  {
    name: 'drawTextCentered',
    insertText: 'drawTextCentered(${1:x}, ${2:y}, ${3:text})',
    docLink: 'F006350',
  },
  { name: 'drawChar', insertText: 'drawChar(${1:x}, ${2:y}, ${3:ch})', docLink: 'F006400' },
  {
    name: 'drawCharCentered',
    insertText: 'drawCharCentered(${1:x}, ${2:y}, ${3:ch})',
    docLink: 'F006450',
  },
  { name: 'textFont', insertText: 'textFont(${1:fontid})', docLink: 'F006500' },
  { name: 'textWidth', insertText: 'textWidth(${1:text})', docLink: 'F006600' },
  {
    name: 'textLeading',
    insertText: 'textLeading(${1:leading})',
    docLink: 'F006700',
  },
  { name: 'addBezierVertex', insertText: 'addBezierVertex(${1:x}, ${2:y})', docLink: 'F007010' },
  { name: 'push', insertText: 'push()', docLink: 'F007100' },
  { name: 'pop', insertText: 'pop()', docLink: 'F007200' },
  { name: 'rotate', insertText: 'rotate(${1:rad})', docLink: 'F007300' },
  { name: 'scale', insertText: 'scale(${1:v})' },
  { name: 'translate', insertText: 'translate(${1:x}, ${2:y})', docLink: 'F007400' },
  {
    name: 'clipRectangle',
    insertText: 'clipRectangle(${1:x}, ${2:y}, ${3:w}, ${4:h})',
    docLink: 'F007410',
  },
  { name: 'noClipping', insertText: 'noClipping()', docLink: 'F007420' },
  { name: 'tone', insertText: 'tone(${1:frequency}, ${2:duration})', docLink: 'F007600' },
  { name: 'noTone', insertText: 'noTone()', docLink: 'F007700' },
  {
    name: 'getAcceleration',
    insertText: 'getAcceleration()',
    docLink: 'F007800',
  },
  {
    name: 'getAccelerationXY',
    insertText: 'getAccelerationXY()',
    docLink: 'F007850',
  },
  {
    name: 'returnToMenu',
    insertText: 'returnToMenu()',
    docLink: 'F007900',
  },
  { name: 'restart', insertText: 'restart()', docLink: 'F008000' },
  {
    name: 'setTimeZone',
    insertText: 'setTimeZone(${1:tz})',
    docLink: 'F008100',
  },
  { name: 'setTime', insertText: 'setTime(${1:h}, ${2:m}, ${3:s})', docLink: 'F008200' },
  { name: 'setDate', insertText: 'setDate(${1:d}, ${2:m}, ${3:y})', docLink: 'F008300' },
  { name: 'getYear', insertText: 'getYear()', docLink: 'F008400' },
  { name: 'getMonth', insertText: 'getMonth()', docLink: 'F008500' },
  { name: 'getDay', insertText: 'getDay()', docLink: 'F008600' },
  { name: 'getWeekDay', insertText: 'getWeekDay()', docLink: 'F008700' },
  { name: 'getHour', insertText: 'getHour()', docLink: 'F008800' },
  { name: 'getMinute', insertText: 'getMinute()', docLink: 'F008900' },
  { name: 'getSecond', insertText: 'getSecond()', docLink: 'F009000' },

  { name: 'setPrecision', insertText: 'setPrecision(${1:val})', docLink: 'SYSF000300' },
  { name: 'print', insertText: 'print(${1:str})', docLink: 'SYSF000400' },
  { name: 'setAutostart', insertText: 'setAutostart()', docLink: 'SYSF000500' },
  { name: 'turnOff', insertText: 'turnOff()', docLink: 'SYSF000600' },
  { name: 'sleep', insertText: 'sleep(${1:sec})', docLink: 'SYSF000700' },
  { name: 'isConnected', insertText: 'isConnected(${1:sec})', docLink: 'SYSF000750' },
  { name: 'ipAddress', insertText: 'ipAddress()', docLink: 'SYSF000800' },
  { name: 'backlight', insertText: 'backlight(${1:value})', docLink: 'SYSF000900' },
  { name: 'runScript', insertText: 'runScript(${1:path})', docLink: 'SYSF001000' },
  { name: 'textInput', insertText: 'textInput(${1:title}, ${2:text})', docLink: 'SYSF001100' },
  { name: 'getHardwareType', insertText: 'getHardwareType()', docLink: 'SYSF001200' },

  { name: 'getTemperature', insertText: 'getTemperature()', docLink: 'SF000100' },
  { name: 'getHumidity', insertText: 'getHumidity()', docLink: 'SF000200' },
  { name: 'getHumidityAbsolute', insertText: 'getHumidityAbsolute()', docLink: 'SF000250' },
  { name: 'getPressure', insertText: 'getPressure()', docLink: 'SF000300' },
  { name: 'getAmbientRGB', insertText: 'getAmbientRGB()', docLink: 'SF000400' },
  { name: 'getAmbientIR', insertText: 'getAmbientIR()', docLink: 'SF000500' },
  { name: 'getAmbientLux', insertText: 'getAmbientLux()', docLink: 'SF000550' },
  { name: 'getCO2', insertText: 'getCO2()', docLink: 'SF000600' },
  { name: 'getIAQ', insertText: 'getIAQ()', docLink: 'SF000700' },
  { name: 'getTVOC', insertText: 'getTVOC()', docLink: 'SF000800' },
  { name: 'getETOH', insertText: 'getETOH()', docLink: 'SF000900' },
  { name: 'getMicrophoneAmplitude', insertText: 'getMicrophoneAmplitude()', docLink: 'SF001000' },
  { name: 'getMicrophoneDecibel', insertText: 'getMicrophoneDecibel()', docLink: 'SF001100' },
  { name: 'getMicrophoneFrequency', insertText: 'getMicrophoneFrequency()', docLink: 'SF001200' },

  { name: 'open', insertText: 'open(${1:type}, ${2:path})', docLink: 'FF000100' },
  { name: 'write', insertText: 'write(${1:val})', docLink: 'FF000200' },
  { name: 'writeByte', insertText: 'writeByte(${1:val})', docLink: 'FF000300' },
  { name: 'writeInt', insertText: 'writeInt(${1:val})', docLink: 'FF000400' },
  { name: 'writeLong', insertText: 'writeLong(${1:val})', docLink: 'FF000500' },
  { name: 'writeFloat', insertText: 'writeFloat(${1:val})', docLink: 'FF000600' },
  { name: 'read', insertText: 'read()', docLink: 'FF000700' },
  { name: 'readByte', insertText: 'readByte()', docLink: 'FF000800' },
  { name: 'readInt', insertText: 'readInt()', docLink: 'FF000900' },
  { name: 'readLong', insertText: 'readLong()', docLink: 'FF001000' },
  { name: 'readFloat', insertText: 'readFloat()', docLink: 'FF001100' },
  { name: 'close', insertText: 'close()', docLink: 'FF001200' },
  { name: 'eof', insertText: 'eof()', docLink: 'FF001230' },
  { name: 'fileExists', insertText: 'fileExists(${1:path})', docLink: 'FF001260' },
  { name: 'getFileSize', insertText: 'getFileSize(${1:path})', docLink: 'FF001300' },
  { name: 'deleteFile', insertText: 'deleteFile(${1:path})', docLink: 'FF001400' },
  { name: 'renameFile', insertText: 'renameFile(${1:path}, ${2:newPath})', docLink: 'FF001500' },

  { name: 'beginSong', insertText: 'beginSong()', docLink: 'AF000300' },
  { name: 'note', insertText: 'note(${1:note}, ${2:durFactor})', docLink: 'AF000400' },
  {
    name: 'noteAdvanced',
    insertText: 'noteAdvanced(${1:note}, ${2:durFactor}, ${3:octave}, ${4:articulation})',
    docLink: 'AF000500',
  },
  { name: 'endSong', insertText: 'endSong()', docLink: 'AF000600' },
  { name: 'playSong', insertText: 'playSong(${1:autorepeat})', docLink: 'AF000700' },
  { name: 'pauseSong', insertText: 'pauseSong()', docLink: 'AF000800' },
  { name: 'resumeSong', insertText: 'resumeSong()', docLink: 'AF000900' },
  { name: 'stopSong', insertText: 'stopSong()', docLink: 'AF001000' },
  { name: 'soundEffect', insertText: 'soundEffect(${1:soundid})', docLink: 'AF001100' },
  { name: 'setWaveform', insertText: 'setWaveform(${1:waveForm})', docLink: 'AF001200' },
  { name: 'setOctave', insertText: 'setOctave(${1:octave})', docLink: 'AF001300' },
  { name: 'setBPM', insertText: 'setBPM(${1:bpm})', docLink: 'AF001400' },

  { name: 'getMillis', insertText: 'getMillis()', docLink: 'TF001300' },
  { name: 'setEpoch', insertText: 'setEpoch(${1:epoch})', docLink: 'TF001400' },
  { name: 'getEpoch', insertText: 'getEpoch()', docLink: 'TF001500' },
  { name: 'setTimer', insertText: 'setTimer(${1:ms})', docLink: 'TF001600' },
  { name: 'stopTimer', insertText: 'stopTimer()', docLink: 'TF001700' },
  { name: 'setInterval', insertText: 'setInterval(${1:ms})', docLink: 'TF001800' },
  { name: 'stopInterval', insertText: 'stopInterval()', docLink: 'TF001900' },

  { name: 'logData', insertText: 'logData(${1:type})', docLink: 'LF000100' },
  { name: 'logRead', insertText: 'logRead(${1:type}, ${2:index})', docLink: 'LF000200' },
  { name: 'logClear', insertText: 'logClear(${1:type})', docLink: 'LF000300' },
  { name: 'logCount', insertText: 'logCount(${1:type})', docLink: 'LF000400' },

  { name: 'drawOrigin', insertText: 'drawOrigin()', docLink: '3D000100' },
  { name: 'drawCube', insertText: 'drawCube(${1:size})', docLink: '3D000200' },
  { name: 'drawSphere', insertText: 'drawSphere(${1:size})', docLink: '3D000300' },
  { name: 'drawCuboid', insertText: 'drawCuboid(${1:w}, ${2:l}, ${3:h})', docLink: '3D000400' },
  { name: 'drawCylinder', insertText: 'drawCylinder(${1:r}, ${2:h})', docLink: '3D000500' },
  {
    name: 'drawTriangularPrism',
    insertText: 'drawTriangularPrism(${1:r}, ${2:h})',
    docLink: '3D000600',
  },
  { name: 'translate3D', insertText: 'translate3D(${1:x}, ${2:y}, ${3:z})', docLink: '3D000700' },
  { name: 'translateX', insertText: 'translateX(${1:x})', docLink: '3D000725' },
  { name: 'translateY', insertText: 'translateY(${1:y})', docLink: '3D000750' },
  { name: 'translateZ', insertText: 'translateZ(${1:z})', docLink: '3D000775' },
  { name: 'rotate3D', insertText: 'rotate3D(${1:x}, ${2:y}, ${3:z})', docLink: '3D000800' },
  { name: 'rotateX', insertText: 'rotateX(${1:x})', docLink: '3D000825' },
  { name: 'rotateY', insertText: 'rotateY(${1:y})', docLink: '3D000850' },
  { name: 'rotateZ', insertText: 'rotateZ(${1:z})', docLink: '3D000875' },
  { name: 'scale3D', insertText: 'scale3D(${1:x}, ${2:y}, ${3:z})', docLink: '3D000900' },
  { name: 'scaleX', insertText: 'scaleX(${1:x})', docLink: '3D000925' },
  { name: 'scaleY', insertText: 'scaleY(${1:y})', docLink: '3D000950' },
  { name: 'scaleZ', insertText: 'scaleZ(${1:z})', docLink: '3D000975' },
  {
    name: 'translateCamera3D',
    insertText: 'translateCamera3D(${1:x}, ${2:y}, ${3:z})',
    docLink: '3D001000',
  },
  { name: 'translateCameraX', insertText: 'translateCameraX(${1:x})', docLink: '3D001025' },
  { name: 'translateCameraY', insertText: 'translateCameraY(${1:y})', docLink: '3D001050' },
  { name: 'translateCameraZ', insertText: 'translateCameraZ(${1:z})', docLink: '3D001075' },
  {
    name: 'rotateCamera3D',
    insertText: 'rotateCamera3D(${1:x}, ${2:y}, ${3:z})',
    docLink: '3D001100',
  },
  { name: 'rotateCameraX', insertText: 'rotateCameraX(${1:x})', docLink: '3D001125' },
  { name: 'rotateCameraY', insertText: 'rotateCameraY(${1:y})', docLink: '3D001150' },
  { name: 'rotateCameraZ', insertText: 'rotateCameraZ(${1:z})', docLink: '3D001175' },
  {
    name: 'drawShape3D',
    insertText: 'drawShape3D(${1:vertices}, ${2:triangles})',
    docLink: '3D001200',
  },
  { name: 'beginShape3D', insertText: 'beginShape3D()', docLink: '3D001300' },
  { name: 'endShape3D', insertText: 'endShape3D()', docLink: '3D001400' },
  {
    name: 'addVertex3D',
    insertText: 'addVertex3D(${1:x}, ${2:y}, ${3:z})',
    docLink: '3D001500',
  },
  { name: 'render', insertText: 'render()', docLink: '3D001600' },
  { name: 'translationMode', insertText: 'translationMode(${1:mode})', docLink: '3D001700' },
  { name: 'rotationMode', insertText: 'rotationMode(${1:mode})', docLink: '3D001800' },
  { name: 'getWorldRotation3D', insertText: 'getWorldRotation3D()', docLink: '3D001900' },
  {
    name: 'setWorldRotation3D',
    insertText: 'setWorldRotation3D(${1:rotation})',
    docLink: '3D002000',
  },
  {
    name: 'rotateAroundAxis',
    insertText: 'rotateAroundAxis(${1:angle}, ${2:axis})',
    docLink: '3D002100',
  },

  { name: 'noise', insertText: 'noise(${1:x})', docLink: 'MF003000' },
  { name: 'noise2D', insertText: 'noise2D(${1:x}, ${2:y})', docLink: 'MF003025' },
  { name: 'noise3D', insertText: 'noise3D(${1:x}, ${2:y}, ${3:z})', docLink: 'MF003050' },

  { name: 'initGPIO', insertText: 'initGPIO(${1:pinNr}, ${2:mode})', docLink: 'IOF000100' },
  { name: 'writeGPIO', insertText: 'writeGPIO(${1:pinNr}, ${2:state})', docLink: 'IOF000200' },
  { name: 'readGPIO', insertText: 'readGPIO(${1:pinNr})', docLink: 'IOF000300' },
  { name: 'readADC', insertText: 'readADC(${1:pinNr}, ${2:nSamples})', docLink: 'IOF000400' },
  { name: 'writeDAC', insertText: 'writeDAC(${1:pinNr}, ${2:value})', docLink: 'IOF000410' },
  {
    name: 'writePWM',
    insertText: 'writePWM(${1:pinNr}, ${2:dutyCycleValue})',
    docLink: 'IOF000420',
  },
  { name: 'setPWMFrequency', insertText: 'setPWMFrequency(${1:freq})', docLink: 'IOF000430' },
  {
    name: 'setPWMDutyCycleResolution',
    insertText: 'setPWMDutyCycleResolution(${1:res})',
    docLink: 'IOF000440',
  },
  {
    name: 'checkI2CAddress',
    insertText: 'checkI2CAddress(${1:slaveAddr})',
    docLink: 'IOF000490',
  },
  {
    name: 'writeI2CByte',
    insertText: 'writeI2CByte(${1:slaveAddr}, ${2:byteAddr}, ${3:byte})',
    docLink: 'IOF000500',
  },
  {
    name: 'writeI2CInt',
    insertText: 'writeI2CInt(${1:slaveAddr}, ${2:byteAddr}, ${3:data})',
    docLink: 'IOF000600',
  },
  {
    name: 'writeI2CLong',
    insertText: 'writeI2CLong(${1:slaveAddr}, ${2:byteAddr}, ${3:data})',
    docLink: 'IOF000700',
  },
  {
    name: 'writeI2C',
    insertText: 'writeI2C(${1:slaveAddr}, ${2:byteAddr}, ${3:data})',
    docLink: 'IOF000800',
  },
  {
    name: 'readI2CByte',
    insertText: 'readI2CByte(${1:slaveAddr}, ${2:byteAddr})',
    docLink: 'IOF000900',
  },
  {
    name: 'readI2CInt',
    insertText: 'readI2CInt(${1:slaveAddr}, ${2:byteAddr})',
    docLink: 'IOF001000',
  },
  {
    name: 'readI2CLong',
    insertText: 'readI2CLong(${1:slaveAddr}, ${2:byteAddr})',
    docLink: 'IOF001100',
  },
  {
    name: 'readI2C',
    insertText: 'readI2C(${1:slaveAddr}, ${2:byteAddr}, ${3:size})',
    docLink: 'IOF001200',
  },
  { name: 'getI2CByte', insertText: 'getI2CByte()', docLink: 'IOF001300' },
  { name: 'getI2CInt', insertText: 'getI2CInt()', docLink: 'IOF001400' },
  { name: 'getI2CLong', insertText: 'getI2CLong()', docLink: 'IOF001500' },
  {
    name: 'setI2CReadBufferIndex',
    insertText: 'setI2CReadBufferIndex(${1:index})',
    docLink: 'IOF001600',
  },
  {
    name: 'setI2CByteAddrSize',
    insertText: 'setI2CByteAddrSize(${1:size})',
    docLink: 'IOF001700',
  },
  {
    name: 'getI2CByteAddrSize',
    insertText: 'getI2CByteAddrSize(${1:size})',
    docLink: 'IOF001800',
  },
  {
    name: 'initDigitalLeds',
    insertText: 'initDigitalLeds(${1:pinNr},${2:ledsCount},${3:ledType})',
    docLink: 'IOF001900',
  },
  {
    name: 'setDigitalLed',
    insertText: 'setDigitalLed(${1:ledNr},${2:r},${3:g},${4:b})',
    docLink: 'IOF002000',
  },
  {
    name: 'applyDigitalLeds',
    insertText: 'applyDigitalLeds()',
    docLink: 'IOF002100',
  },

  { name: 'strToBool', insertText: 'strToBool(${1:str})', docLink: 'STRF000100' },
  { name: 'strToInt', insertText: 'strToInt(${1:str})', docLink: 'STRF000200' },
  { name: 'strToFloat', insertText: 'strToFloat(${1:str})', docLink: 'STRF000300' },
  { name: 'strLen', insertText: 'strLen(${1:str})', docLink: 'STRF000400' },
  { name: 'strFind', insertText: 'strFind(${1:str}, ${2:search})', docLink: 'STRF000500' },
  {
    name: 'strSubstring',
    insertText: 'strSubstring(${1:str}, ${2:from}, ${3:length})',
    docLink: 'STRF000600',
  },
  { name: 'getRequest', insertText: 'getRequest(${1:url})', docLink: 'NWF000100' },
  { name: 'readRequestLength', insertText: 'readRequestLength()', docLink: 'NWF000200' },
  { name: 'readRequest', insertText: 'readRequest(${1:offset})', docLink: 'NWF000300' },
  { name: 'readRequestJSON', insertText: 'readRequestJSON(${1:jsonPath})', docLink: 'NWF000400' },
  { name: 'postRequest', insertText: 'postRequest(${1:url}, ${2:body})', docLink: 'NWF000500' },
  { name: 'selectCertificate', insertText: 'selectCertificate(${1:path})', docLink: 'NWF000600' },
  {
    name: 'connectMQTT',
    insertText: 'connectMQTT(${1:uri}, ${1:username}, ${1:password})',
    docLink: 'NWF000700',
  },
  { name: 'disconnectMQTT', insertText: 'disconnectMQTT()', docLink: 'NWF000800' },
  { name: 'configMQTT', insertText: 'configMQTT()', docLink: 'NWF000850' },
  { name: 'publishMQTT', insertText: 'publishMQTT(${1:topic}, ${1:data})', docLink: 'NWF000900' },
  { name: 'subscribeMQTT', insertText: 'subscribeMQTT(${1:topic})', docLink: 'NWF001000' },
  { name: 'unsubscribeMQTT', insertText: 'unsubscribeMQTT(${1:topic})', docLink: 'NWF001100' },
  { name: 'hasMQTTMessage', insertText: 'hasMQTTMessage()', docLink: 'NWF001200' },
  { name: 'getMQTTTopic', insertText: 'getMQTTTopic()', docLink: 'NWF001300' },
  { name: 'getMQTTData', insertText: 'getMQTTData()', docLink: 'NWF001400' },
];

/* Monaco Editor Monarch definition for the NanoPy language.
 * The language is inherited from the python language definition. */
export function getMonarchTokensProvide(): monaco.languages.IMonarchLanguage {
  return {
    defaultToken: '',

    keywords: nanopyKeywords,

    constants: nanopyConstants,

    functions: nanopyFunctions.map((func) => func.name),

    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.bracket' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
    ],

    tokenizer: {
      root: [
        { include: '@whitespace' },
        { include: '@numbers' },
        { include: '@strings' },

        [/[,:;]/, 'delimiter'],
        [/[{}[\]()]/, '@brackets'],

        [/@[a-zA-Z]\w*/, 'tag'],

        [
          /([a-zA-Z_{1}][a-zA-Z0-9_]+\s?)(?=\()/,
          {
            cases: {
              '@keywords': 'keyword',
              '@constants': 'constants',
              '@functions': 'function',
              '@default': 'customfunction',
            },
          },
        ],

        [
          /[a-zA-Z]\w*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@constants': 'constants',
              '@functions': 'function',
              '@default': 'identifier',
            },
          },
        ],
      ],

      // Deal with white space, including single and multi-line comments
      whitespace: [
        [/\s+/, 'white'],
        [/(^#.*$)/, 'comment'],
        [/('''.*''')|(""".*""")/, 'string'],
        [/'''.*$/, 'string', '@endDocString'],
        [/""".*$/, 'string', '@endDblDocString'],
      ],
      endDocString: [
        [/\\'/, 'string'],
        [/.*'''/, 'string', '@popall'],
        [/.*$/, 'string'],
      ],
      endDblDocString: [
        [/\\"/, 'string'],
        [/.*"""/, 'string', '@popall'],
        [/.*$/, 'string'],
      ],

      // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
      numbers: [
        [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number'],
        [/-?0b([01])+/, 'number'],
        [/-?(\d*\.)?\d+([eE][+-]?\d+)?[jJ]?[lL]?/, 'number'],
      ],

      // Recognize strings, including those broken across lines with \ (but not without)
      strings: [
        [/'$/, 'string.escape', '@popall'],
        [/'/, 'string.escape', '@stringBody'],
        [/"$/, 'string.escape', '@popall'],
        [/"/, 'string.escape', '@dblStringBody'],
      ],
      stringBody: [
        [/[^\\']+$/, 'string', '@popall'],
        [/[^\\']+/, 'string'],
        [/\\./, 'string'],
        [/'/, 'string.escape', '@popall'],
        [/\\$/, 'string'],
      ],
      dblStringBody: [
        [/[^\\"]+$/, 'string', '@popall'],
        [/[^\\"]+/, 'string'],
        [/\\./, 'string'],
        [/"/, 'string.escape', '@popall'],
        [/\\$/, 'string'],
      ],
    },
  };
}

/* Function to get a completion items provider for code completion */
export function getMonarchCompletionItemProvider(): monaco.languages.CompletionItemProvider {
  return {
    provideCompletionItems: (model, position) => {
      let suggestions: monaco.languages.CompletionItem[] = [];

      const lineContent = model.getLineContent(position.lineNumber).replaceAll(' ', '');

      if (!lineContent.endsWith('.')) {
        /* Add al constants to the suggestions array */
        const constantSuggestions = nanopyConstants.map(
          (constant) =>
            ({
              label: constant,
              kind: monaco.languages.CompletionItemKind.Constant,
              insertText: constant,
            }) as monaco.languages.CompletionItem
        );

        suggestions = suggestions.concat(constantSuggestions);

        /* Add al keywords to the suggestions array */
        const keywordsSuggestions = nanopyKeywords.map(
          (keyword) =>
            ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
            }) as monaco.languages.CompletionItem
        );

        suggestions = suggestions.concat(keywordsSuggestions);

        const lineContentLength = lineContent.length;
        const currentWord = model.getWordAtPosition(position)?.word || '';

        /* Only add the function suggestions if we are at the start of a line */
        if (lineContentLength - currentWord.length === 0) {
          /* Add all functions to the suggestions array */
          const functionSuggestions = nanopyFunctions.map(
            (func) =>
              ({
                label: func.name,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: func.insertText,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              }) as monaco.languages.CompletionItem
          );

          suggestions = suggestions.concat(functionSuggestions);
        }
      }

      return { suggestions };
    },
  };
}
