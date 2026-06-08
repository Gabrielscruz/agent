import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BatteryCharging,
  BrainCircuit,
  Cpu,
  Mic,
  Radar,
  RotateCcw,
  Send,
  Shield,
  Signal,
  Terminal,
  Zap,
} from 'lucide-react';
import './styles.css';
import hologramFigure from './assets/hologram-figure.svg';
import hudOrb from './assets/hud-orb.svg';

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
const HOLOGRAM_MEDIA_URL =
  import.meta.env.VITE_HOLOGRAM_MEDIA_URL || import.meta.env.VITE_HOLOGRAM_VIDEO_URL;

const diagnostics = [
  { label: 'Power', value: '98%', icon: Zap, tone: 'hot' },
  { label: 'Neural', value: 'Online', icon: BrainCircuit, tone: 'cool' },
  { label: 'Defense', value: 'Active', icon: Shield, tone: 'green' },
  { label: 'CPU', value: '41%', icon: Cpu, tone: 'cool' },
];

const logs = [
  'Inicializando protocolo SEXTA-FEIRA...',
  'Sincronizando núcleo de voz Puter TTS',
  'Sensores locais calibrados',
  'Webhook n8n conectado: /webhook/n8n-connection',
];

const initialConversation = [
  {
    role: 'assistant',
    text: 'Sexta-feira online. Todos os sistemas carregados e prontos para uso.',
    time: 'sistema',
  },
];

const FEMALE_VOICE_PATTERN =
  /female|feminin|mulher|woman|maria|helena|luciana|lucia|leticia|camila|vitoria|vit(o|ó)ria|francisca|fernanda|microsoft maria|google português/i;
const VOICE_SILENCE_DELAY_MS = 2600;

function extractN8nOutput(payload) {
  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return extractN8nOutput(payload[0]);
  }

  if (!payload || typeof payload !== 'object') {
    return '';
  }

  return (
    payload.output ||
    payload.text ||
    payload.response ||
    payload.message ||
    payload.body?.output ||
    payload.body?.text ||
    ''
  );
}

async function readWebhookResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return extractN8nOutput(await response.json());
  }

  const text = await response.text();

  try {
    return extractN8nOutput(JSON.parse(text));
  } catch {
    return text;
  }
}

function getFridayVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const preferredVoice =
    voices.find((voice) => voice.lang === 'pt-BR' && /google/i.test(voice.name) && FEMALE_VOICE_PATTERN.test(voice.name)) ||
    voices.find((voice) => voice.lang.startsWith('pt') && /google/i.test(voice.name) && FEMALE_VOICE_PATTERN.test(voice.name)) ||
    voices.find((voice) => voice.lang === 'pt-BR' && /google/i.test(voice.name)) ||
    voices.find((voice) => voice.lang.startsWith('pt') && /google/i.test(voice.name)) ||
    voices.find((voice) => voice.lang === 'pt-BR' && FEMALE_VOICE_PATTERN.test(voice.name)) ||
    voices.find((voice) => voice.lang.startsWith('pt') && FEMALE_VOICE_PATTERN.test(voice.name)) ||
    voices.find((voice) => FEMALE_VOICE_PATTERN.test(voice.name)) ||
    voices.find((voice) => voice.lang === 'pt-BR') ||
    voices.find((voice) => voice.lang.startsWith('pt')) ||
    voices[0];

  return preferredVoice || null;
}

function DataCard({ label, value, icon: Icon, tone }) {
  return (
    <article className={`data-card ${tone}`}>
      <div className="card-icon">
        <Icon size={20} strokeWidth={1.7} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function CoreHud() {
  const [mediaFailed, setMediaFailed] = useState(false);
  const shouldShowMedia = HOLOGRAM_MEDIA_URL && !mediaFailed;
  const isImageMedia = /\.(gif|png|jpe?g|webp|avif|svg)(\?.*)?$/i.test(HOLOGRAM_MEDIA_URL || '');

  return (
    <section className="hologram-stage" aria-label="Holograma central do assistente">
      <div className="holo-grid" />
      {shouldShowMedia && isImageMedia ? (
        <img
          className="hologram-media"
          src={HOLOGRAM_MEDIA_URL}
          alt=""
          aria-hidden="true"
          onError={() => setMediaFailed(true)}
        />
      ) : shouldShowMedia ? (
        <video
          className="hologram-media"
          src={HOLOGRAM_MEDIA_URL}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setMediaFailed(true)}
        />
      ) : (
        <img className="hologram-figure" src={hologramFigure} alt="" aria-hidden="true" />
      )}
      <div className="holo-base" />
    </section>
  );
}

function EarthPanel() {
  return (
    <section className="hud-panel earth-panel">
      <div className="earth-orb">
        <div className="earth-glow" />
      </div>
      <div className="hud-row">
        <span>EARTH</span>
        <strong>N33</strong>
      </div>
      <div className="hud-row active">
        <span>N8N</span>
        <strong>ACTIVATED</strong>
      </div>
    </section>
  );
}

function LoadingPanel() {
  const loaders = [
    ['66UL-054', '58'],
    ['YUGOT289', '38'],
    ['FALKAP943', '51'],
  ];

  return (
    <section className="hud-panel loading-panel">
      {loaders.map(([label, value]) => (
        <div className="loader-line" key={label}>
          <span>{label} LOADING...</span>
          <div className="loader-track">
            <i style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
      <div className="bar-grid">
        {[58, 38, 51, 71].map((value) => (
          <div key={value}>
            <i style={{ height: `${value}%` }} />
            <span>{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrackingPanel() {
  return (
    <section className="hud-panel tracking-panel">
      <img className="hud-orb-img" src={hudOrb} alt="" aria-hidden="true" />
      <h2>
        Tracking
        <span>System Status</span>
        <strong>Online</strong>
      </h2>
    </section>
  );
}

function SecurityPanel() {
  return (
    <section className="hud-panel security-panel">
      <div className="security-copy">
        <p>[SECURITY] ENCRYPTION ENABLED</p>
        <p>[SYSTEM] SEXTA-FEIRA INITIALIZED</p>
        <p>[DATA] PROCESSING USER QUERY</p>
        <p>[AUDIO] VOICE RECOGNITION ACTIVE</p>
      </div>
      <div className="orb-metrics">
        {[51, 63, 54, 18].map((value) => (
          <span key={value}>{value}</span>
        ))}
      </div>
    </section>
  );
}

function getLogTime() {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}

function ConversationPanel({ messages }) {
  return (
    <section className="hud-panel conversation-panel">
      <div className="panel-title">
        <Mic size={18} />
        Conversas
      </div>
      <div className="conversation-list">
        {messages.map((message, index) => (
          <article className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.role === 'user' ? 'Voce' : 'Sexta-feira'} · {message.time}</span>
            <p>{message.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function N8nLogPanel({ logs: n8nLogs }) {
  return (
    <section className="hud-panel n8n-log-panel">
      <div className="panel-title">
        <Terminal size={18} />
        Logs n8n
      </div>
      <div className="terminal-lines n8n-lines">
        {n8nLogs.map((line, index) => (
          <p key={`${line}-${index}`}>
            <span>&gt;</span> {line}
          </p>
        ))}
      </div>
    </section>
  );
}

function VoiceWidgetSlot({
  onSendCommand,
  onVoiceCommand,
  command,
  setCommand,
  isListening,
  isSending,
  lastResponse,
  onRepeatResponse,
}) {
  return (
    <form className="voice-panel" onSubmit={onSendCommand}>
      <div>
        <p className="eyebrow">Sexta-feira Online</p>
        <h2>Sistema ativo</h2>
        <p>
          Aperte espaço ou clique em Falar. O envio acontece apos alguns segundos de silencio.
        </p>
      </div>
      <label className="command-field">
        <span>Digite uma tarefa</span>
        <textarea
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="Ex: Sexta-feira, crie uma tarefa para verificar meus e-mails"
          rows={4}
        />
      </label>
      <div className="command-actions">
        <button className="mic-button secondary" type="button" onClick={onVoiceCommand} disabled={isSending || isListening}>
          <Mic size={22} />
          <span>{isListening ? 'Ouvindo' : 'Falar'}</span>
        </button>
        <button className="mic-button" type="submit" disabled={isSending}>
          <Send size={22} />
          <span>{isSending ? 'Enviando' : 'Enviar'}</span>
        </button>
      </div>
      {lastResponse ? (
        <section className="response-box" aria-label="Ultima resposta da Sexta-feira">
          <div>
            <p className="eyebrow">Resposta</p>
            <strong>{lastResponse}</strong>
            <small className="voice-badge">Voz do navegador ajustada</small>
          </div>
          <button className="repeat-button" type="button" onClick={onRepeatResponse}>
            <RotateCcw size={18} />
            Repetir
          </button>
        </section>
      ) : null}
    </form>
  );
}

function App() {
  const [command, setCommand] = useState('');
  const [consoleLogs, setConsoleLogs] = useState(logs);
  const [conversationLogs, setConversationLogs] = useState(initialConversation);
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const isSendingRef = useRef(false);
  const isListeningRef = useRef(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const voiceTranscriptRef = useRef('');
  const voiceSentRef = useRef(false);
  const currentAudioRef = useRef(null);

  useEffect(() => {
    isSendingRef.current = isSending;
  }, [isSending]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    function handleSpaceShortcut(event) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.code !== 'Space' || isTyping) {
        return;
      }

      event.preventDefault();
      handleVoiceCommand();
    }

    window.addEventListener('keydown', handleSpaceShortcut);

    return () => {
      window.removeEventListener('keydown', handleSpaceShortcut);
      window.clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.abort?.();
    };
  }, []);

  function speakWithBrowserVoice(text) {
    if (!('speechSynthesis' in window)) {
      setConsoleLogs((currentLogs) => [
        'Sintese de voz nao suportada neste navegador.',
        ...currentLogs,
      ]);
      return;
    }

    window.speechSynthesis.cancel();
    currentAudioRef.current?.pause?.();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    const selectedVoice = getFridayVoice();
    utterance.voice = selectedVoice;
    utterance.rate = 0.94;
    utterance.pitch = 1.02;
    utterance.volume = 1;

    setConsoleLogs((currentLogs) => [
      `Voz selecionada: ${selectedVoice?.name || 'padrao do navegador'}`,
      ...currentLogs,
    ]);

    utterance.onerror = (event) => {
      setConsoleLogs((currentLogs) => [
        `Falha ao falar resposta: ${event.error}`,
        ...currentLogs,
      ]);
    };

    window.speechSynthesis.speak(utterance);
  }

  async function speakLikeFriday(text) {
    window.speechSynthesis?.cancel?.();
    currentAudioRef.current?.pause?.();

    if (!window.puter?.ai?.txt2speech) {
      setConsoleLogs((currentLogs) => [
        'Puter TTS indisponivel, usando voz do navegador.',
        ...currentLogs,
      ]);
      speakWithBrowserVoice(text);
      return;
    }

    try {
      setConsoleLogs((currentLogs) => [
        'Gerando voz feminina fixa via Puter TTS...',
        ...currentLogs,
      ]);

      const audio = await window.puter.ai.txt2speech(text, {
        provider: 'xai',
        voice: 'ara',
        output_format: 'mp3',
      });

      currentAudioRef.current = audio;
      await audio.play();

      setConsoleLogs((currentLogs) => [
        'Voz selecionada: Puter xAI ara',
        ...currentLogs,
      ]);
    } catch (error) {
      setConsoleLogs((currentLogs) => [
        `Falha no Puter TTS: ${error.message}. Usando voz do navegador.`,
        ...currentLogs,
      ]);
      speakWithBrowserVoice(text);
    }
  }

  async function sendCommandToN8n(rawCommand) {
    const trimmedCommand = rawCommand.trim();
    if (!trimmedCommand || isSending) {
      return;
    }

    setConversationLogs((currentLogs) => [
      ...currentLogs,
      { role: 'user', text: trimmedCommand, time: getLogTime() },
    ]);
    setIsSending(true);
    setConsoleLogs((currentLogs) => [
      `Enviando comando para n8n: "${trimmedCommand}"`,
      ...currentLogs,
    ]);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'sexta-feira-react-vite',
          command: trimmedCommand,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Resposta HTTP ${response.status}`);
      }

      const n8nOutput = (await readWebhookResponse(response)).trim();
      const spokenResponse =
        n8nOutput || 'Comando recebido, mas o n8n nao retornou uma resposta para falar.';

      setLastResponse(spokenResponse);
      setConversationLogs((currentLogs) => [
        ...currentLogs,
        { role: 'assistant', text: spokenResponse, time: getLogTime() },
      ]);
      speakLikeFriday(spokenResponse);
      setConsoleLogs((currentLogs) => [
        `Sexta-feira respondeu: "${spokenResponse}"`,
        ...currentLogs,
      ]);
      setCommand('');
    } catch (error) {
      setConsoleLogs((currentLogs) => [
        `Falha ao chamar o webhook: ${error.message}`,
        ...currentLogs,
      ]);
      setConversationLogs((currentLogs) => [
        ...currentLogs,
        {
          role: 'assistant',
          text: `Nao consegui conectar ao n8n: ${error.message}`,
          time: getLogTime(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  async function handleSendCommand(event) {
    event.preventDefault();
    await sendCommandToN8n(command);
  }

  function handleVoiceCommand() {
    if (isListeningRef.current || isSendingRef.current) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setConsoleLogs((currentLogs) => [
        'Reconhecimento de voz nao suportado neste navegador.',
        ...currentLogs,
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    window.clearTimeout(silenceTimerRef.current);
    voiceTranscriptRef.current = '';
    voiceSentRef.current = false;

    function sendVoiceTranscript() {
      const finalTranscript = voiceTranscriptRef.current.trim();

      if (!finalTranscript || voiceSentRef.current) {
        return;
      }

      voiceSentRef.current = true;
      try {
        recognition.stop();
      } catch {
        // O navegador pode encerrar a captura sozinho antes do timer.
      }
      sendCommandToN8n(finalTranscript);
    }

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      setConsoleLogs((currentLogs) => [
        `Ouvindo comando de voz... envie apos ${VOICE_SILENCE_DELAY_MS / 1000}s de silencio`,
        ...currentLogs,
      ]);
    };

    recognition.onresult = (event) => {
      let transcript = '';

      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }

      const normalizedTranscript = transcript.trim();
      voiceTranscriptRef.current = normalizedTranscript;
      setCommand(normalizedTranscript);

      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = window.setTimeout(() => {
        sendVoiceTranscript();
      }, VOICE_SILENCE_DELAY_MS);
    };

    recognition.onerror = (event) => {
      setConsoleLogs((currentLogs) => [
        `Falha no reconhecimento de voz: ${event.error}`,
        ...currentLogs,
      ]);
    };

    recognition.onend = () => {
      setIsListening(false);
      isListeningRef.current = false;
      window.clearTimeout(silenceTimerRef.current);

      if (voiceTranscriptRef.current.trim() && !voiceSentRef.current) {
        silenceTimerRef.current = window.setTimeout(() => {
          sendVoiceTranscript();
        }, VOICE_SILENCE_DELAY_MS);
      }
    };

    recognition.start();
  }

  function handleRepeatResponse() {
    if (lastResponse) {
      speakLikeFriday(lastResponse);
    }
  }

  return (
    <main className="app-shell">
      <div className="grid-overlay" />

      <section className="dashboard-layout">
        <aside className="side-stack left-zone">
          <ConversationPanel messages={conversationLogs} />
        </aside>

        <section className="center-stack">
          <CoreHud />
          <VoiceWidgetSlot
            command={command}
            isListening={isListening}
            isSending={isSending}
            lastResponse={lastResponse}
            onVoiceCommand={handleVoiceCommand}
            onRepeatResponse={handleRepeatResponse}
            onSendCommand={handleSendCommand}
            setCommand={setCommand}
          />
        </section>

        <aside className="side-stack right-zone">
          <N8nLogPanel logs={consoleLogs} />
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
