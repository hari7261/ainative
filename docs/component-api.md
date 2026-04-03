# Component API Reference

## AIApp

Root component that initializes the AINative runtime.

### Props

```typescript
interface AIAppProps {
  config: AppConfig;
  children: (state: AIState, app: AIApp) => React.ReactNode;
}

interface AppConfig {
  apiUrl: string;
  streamMethod?: 'SSE' | 'WS' | 'AUTO';
  initialState?: Partial<AIState>;
  reconnect?: boolean;
  debug?: boolean;
}
```

### Example

```tsx
<AIAppComponent config={{ apiUrl: 'http://localhost:3001' }}>
  {(state, app) => <YourComponent state={state} app={app} />}
</AIAppComponent>
```

## AIInput

Enhanced input component with multimodal support.

### Props

```typescript
interface AIInputProps {
  onSubmit: (message: string, attachments?: any[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  enableAudio?: boolean;
  enableImage?: boolean;
  enableFile?: boolean;
  className?: string;
}
```

### Example

```tsx
<AIInput
  onSubmit={(msg, attachments) => app.sendMessage(msg)}
  placeholder="Type your message..."
  enableAudio={true}
  enableImage={true}
/>
```

## AIStream

Displays individual streaming messages.

### Props

```typescript
interface AIStreamProps {
  message: Message;
  showMetadata?: boolean;
  className?: string;
  renderContent?: (content: string) => React.ReactNode;
}
```

### Example

```tsx
<AIStream
  message={message}
  showMetadata={true}
  renderContent={(content) => <ReactMarkdown>{content}</ReactMarkdown>}
/>
```

## AIStreamList

Displays a list of streaming messages.

### Props

```typescript
interface AIStreamListProps {
  messages: Message[];
  showMetadata?: boolean;
  className?: string;
  renderContent?: (content: string) => React.ReactNode;
}
```

### Example

```tsx
<AIStreamList
  messages={state.messages}
  showMetadata={false}
/>
```

## AIPane

Complete chat interface with header, messages, and input.

### Props

```typescript
interface AIPaneProps {
  state: AIState;
  onSendMessage: (message: string, attachments?: any[]) => void;
  title?: string;
  subtitle?: string;
  showMetadata?: boolean;
  enableAudio?: boolean;
  enableImage?: boolean;
  enableFile?: boolean;
  className?: string;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}
```

### Example

```tsx
<AIPane
  state={state}
  onSendMessage={(msg) => app.sendMessage(msg)}
  title="My AI Assistant"
  subtitle="Powered by GPT-4"
  enableAudio={true}
  renderFooter={() => <div>Custom footer</div>}
/>
```

## Hooks (Advanced)

### useAIState

Access AI state directly:

```tsx
const { state, setState } = useAIState();
```

### useAIStream

Hook into streaming events:

```tsx
const { isStreaming, tokens } = useAIStream();
```

## Styling

All components accept `className` props for custom styling. Default classes:

- `.ai-pane` - Main container
- `.ai-pane-header` - Header section
- `.ai-pane-content` - Message list area
- `.ai-stream-message` - Individual message
- `.ai-input-container` - Input wrapper
- `.ai-input-field` - Text input
- `.ai-input-submit` - Send button
