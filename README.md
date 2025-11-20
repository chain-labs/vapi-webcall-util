# VAPI Web Call Utility

A simple web application to make VAPI calls directly from your browser with custom metadata.

## Features

- Start VAPI web calls from the browser
- Pass Call ID and Name as metadata
- Name is also passed as a variable for use in welcome messages and system prompts
- Clean, modern UI with real-time call status
- Full call control (Start/End)
- **Query parameter support** for auto-filling form fields
- **Environment variable support** for API key and Assistant ID

## Setup

### Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your VAPI credentials:
   ```
   VITE_VAPI_PUBLIC_KEY=your_actual_vapi_public_key
   VITE_VAPI_ASSISTANT_ID=your_actual_assistant_id
   ```

The `.env` file is gitignored for security.

### Development

Start the development server:
```bash
npm run dev
```

### Build for Production

Build the application:
```bash
npm run build
```

## Usage

### Basic Usage

1. Open `index.html` in your web browser (or use `npm run dev` for development)
2. Fill in the required fields:
   - **Call ID**: Unique identifier for this call (will be sent as metadata)
   - **Name**: Your name (sent as metadata and variable for personalization)
   - **Email**: Your email address
   - **Business Type**: Type of business
   - **Country**: Your country
   - **Websites**: Your websites (comma-separated)
   - **VAPI Public API Key**: Your VAPI public key (auto-filled from .env if configured)
   - **Assistant ID**: The ID of your VAPI assistant (auto-filled from .env if configured)
3. Click "Start Call" to begin the conversation
4. Click "End Call" to terminate the call

### Query Parameters for Auto-Fill

You can pre-fill form fields using URL query parameters. This is useful for embedding the call interface or sharing pre-configured links.

**Example URL:**
```
http://localhost:5173/?callId=123&name=John%20Doe&email=john@example.com&businessType=Technology&country=US&websites=example.com
```

**Supported Query Parameters:**
- `callId` or `call_id` - Pre-fill the Call ID
- `name` - Pre-fill the Name
- `email` - Pre-fill the Email
- `businessType` or `business_type` - Pre-fill the Business Type
- `country` - Pre-fill the Country
- `websites` - Pre-fill the Websites

**Note:** Query parameters will override environment variable defaults but users can still edit the fields before starting a call.

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
