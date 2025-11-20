# VAPI Web Call Utility

A simple web application to make VAPI calls directly from your browser with custom metadata.

## Features

- Start VAPI web calls from the browser
- Pass Call ID and Name as metadata
- Name is also passed as a variable for use in welcome messages and system prompts
- Clean, modern UI with real-time call status
- Full call control (Start/End)

## Usage

1. Open `index.html` in your web browser
2. Fill in the required fields:
   - **Call ID**: Unique identifier for this call (will be sent as metadata)
   - **Name**: Your name (sent as metadata and variable for personalization)
   - **VAPI Public API Key**: Your VAPI public key
   - **Assistant ID**: The ID of your VAPI assistant
3. Click "Start Call" to begin the conversation
4. Click "End Call" to terminate the call

## How It Works

### Metadata
The Call ID and Name are sent as metadata in the call:
```javascript
metadata: {
  callId: callId,
  name: name
}
```

This metadata will be received by your message webhook configured in the assistant settings.

### Variables
The Name is also passed as a variable:
```javascript
variableValues: {
  name: name
}
```

This allows your assistant to use the name in:
- Welcome messages
- System prompts
- Any other variable references in your assistant configuration

## Events Handled

The app listens to the following VAPI events:
- `call-start`: When the call successfully connects
- `call-end`: When the call terminates
- `speech-start`: When the assistant starts speaking
- `speech-end`: When the assistant finishes speaking
- `volume-level`: Real-time volume monitoring
- `message`: Messages from VAPI
- `error`: Any errors that occur

## Requirements

- Modern web browser with JavaScript enabled
- VAPI public API key
- VAPI assistant ID
- Internet connection

## Running the App

Simply open the `index.html` file in any web browser. No build process or server required.
