# ARCHITECTURE.md — Account Permission Visualizer & Editor

This document describes the architecture, design decisions, and technical approach for the Permission Visualizer & Editor blueprint.

## Overview

The goal is to provide a safe, educational, and highly visual tool for understanding and editing Antelope-style account permissions on WAX. It helps users avoid catastrophic mistakes while learning the permission model.

## Core Principles

- **Safety first**: Never let users make changes that would lock them out or create dangerous permission structures.
- **Visual clarity**: Permission trees and relationships should be immediately understandable.
- **Educational**: The tool should teach good permission practices while being used.
- **Client-side first**: Maximum interactivity with zero custom smart contracts.
- **Accessibility**: Full keyboard, screen reader, and reduced-motion support.

## High-Level Architecture

```
User Interface (Next.js + Tailwind + shadcn/ui + custom pixel CSS)
          │
          ▼
Account Data Fetching (WAX RPC + Hyperion fallback)
          │
          ▼
Permission Engine (pure client-side threshold math + safety rules)
          │
          ▼
Interactive SVG/Canvas Permission Tree
          │
          ▼
Live Threshold Simulator + Risk Analysis
          │
          ▼
Editor Mode with Local Draft Persistence
          │
          ▼
WharfKit Integration (safe on-chain permission changes)
```

## Key Components

| Component                    | Responsibility                                           | Key Technologies                  |
|------------------------------|----------------------------------------------------------|-----------------------------------|
| `PermissionTree`             | Interactive SVG + Canvas hierarchical permission visualizer/editor | Custom SVG + Framer Motion        |
| `ThresholdSimulator`         | Live M-of-N threshold calculation and warnings           | Pure JavaScript engine            |
| `PermissionDetailPanel`      | Detailed view and editing of a selected permission       | React forms + validation          |
| `RiskAnalysisPanel`          | Safety warnings and risk level indicators                | Rule-based analysis               |
| `AccountInput`               | Account lookup with loading and error states             | TanStack Query + native fetch     |

## Data Flow

1. User enters a WAX account
2. System fetches on-chain permission data
3. Permission engine builds the graph and runs safety checks
4. Interactive tree + simulator render the current state
5. In editor mode, user can propose changes with live preview
6. Safety warnings update in real time
7. User can export or submit changes via WharfKit

## Safety & Validation Engine

The core `permissionEngine.ts` contains pure, testable logic with multiple safety rules:
- Owner permission with zero keys
- Threshold higher than total available weight
- Active permission having authority over owner
- Linked permissions that are overly permissive
- High threshold relative to number of keys (governance risk)

These rules run on every change and provide clear, actionable warnings.

## Accessibility & Theming

- Full keyboard navigation and ARIA support
- Respects `prefers-reduced-motion`
- Retro-pixel + glassmorphic + subtle CRT aesthetic using CSS variables
- High contrast modes available

## Future Extensions

- Batch permission auditing across multiple accounts
- Advanced visual diff for permission changes
- Integration with hardware wallet flows
- On-chain simulation with fee estimation
- Export as diagrams or structured reports
- Template library for common safe permission patterns

This architecture prioritizes **safety, education, and clarity** while remaining lightweight and extensible.
