---
inclusion: always
---

# Product Overview

Ghost Chat is a Halloween-themed web app where users input a scenario and watch AI-powered ghost characters (skeleton, pumpkin, witch) engage in automatic conversations based on that situation.

## Core Features

- Noise effect startup animation (≤2 seconds)
- Scenario input (max 500 characters)
- Multiple ghost characters with distinct personas
- AI-generated streaming conversations using Vercel AI SDK
- Animated speech bubbles with character dialogue
- Japanese language interface

## User Flow

1. Noise effect on app launch
2. Input window fades in
3. User enters scenario
4. Ghost characters appear with animations
5. Characters converse automatically based on scenario and personas

## Character System

- Each character has a unique persona defined in `/lib/personas`
- Character images stored as SVGs in `/public/characters`
- Persona documents guide AI conversation generation
- Characters: pumpkin, skeleton, witch
