export function Icon({ children, size = 16, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function LogoMark({ size = 22, title = 'DevSecOps' }) {
  return (
    <Icon size={size} title={title}>
      <path
        d="M12 2.5c3.8 0 7 1.9 8.5 3.1v6.5c0 5-3.6 9.2-8.5 10.4C7.1 21.2 3.5 17 3.5 12.1V5.6C5 4.4 8.2 2.5 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 12.3l1.8 1.8 3.7-4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function GithubActionsIcon({ size = 14, title = 'GitHub Actions' }) {
  return (
    <Icon size={size} title={title}>
      <path d="M12 3a9 9 0 1 0 9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 4v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function DockerIcon({ size = 14, title = 'Docker' }) {
  return (
    <Icon size={size} title={title}>
      {/* Docker whale (outline-style) */}
      <path
        d="M22 12.54c-1.804 -.345 -2.701 -1.08 -3.523 -2.94c-.487 .696 -1.102 1.568 -.92 2.4c.028 .238 -.32 1 -.557 1h-14c0 5.208 3.164 7 6.196 7c4.124 .022 7.828 -1.376 9.854 -5c1.146 -.101 2.296 -1.505 2.95 -2.46"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Containers */}
      <path d="M5 10h3v3H5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 10h3v3H8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M11 10h3v3h-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 10h3v3h-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 7h3v3H8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M11 7h3v3h-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M11 4h3v3h-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />

      {/* Eye (filled dot) */}
      <circle cx="6.5" cy="16.5" r="0.95" fill="currentColor" />
    </Icon>
  )
}

export function SemgrepIcon({ size = 14, title = 'SAST (Semgrep)' }) {
  return (
    <Icon size={size} title={title}>
      <circle cx="10.5" cy="10.5" r="5.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14.6 14.6 19.2 19.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M9.4 8.9 7.9 10.5l1.5 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6 8.9 13.1 10.5l-1.5 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function TrivyIcon({ size = 14, title = 'Trivy' }) {
  return (
    <Icon size={size} title={title}>
      <path
        d="M12 3.3c3.6 0 6.6 1.7 8 2.7v6.2c0 4.7-3.3 8.6-8 9.8-4.7-1.2-8-5.1-8-9.8V6c1.4-1 4.4-2.7 8-2.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.7 12.1h6.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 8.8v6.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

export function ClipboardIcon({ size = 14, title = 'Logs' }) {
  return (
    <Icon size={size} title={title}>
      <path
        d="M8 4.5h8a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 4.5a3 3 0 0 0 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M9 10h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

export function CheckIcon({ size = 18, title = 'Passed' }) {
  return (
    <Icon size={size} title={title}>
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.6 12.2l2.6 2.6 6.2-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function BlockIcon({ size = 18, title = 'Blocked' }) {
  return (
    <Icon size={size} title={title}>
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 8l8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function StepIcon({ stepId, size = 20 }) {
  const common = { size, title: stepId }
  switch (stepId) {
    case 'push':
      return (
        <Icon {...common}>
          <path d="M12 19V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M7.5 10.5 12 6l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </Icon>
      )
    case 'trigger':
      return (
        <Icon {...common}>
          <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </Icon>
      )
    case 'sast':
      return <SemgrepIcon size={size} title="SAST" />
    case 'build':
      return <DockerIcon size={size} title="Docker build" />
    case 'trivy':
      return <TrivyIcon size={size} title="Trivy" />
    case 'gate':
      return (
        <Icon {...common}>
          <path
            d="M12 3.3c3.6 0 6.6 1.7 8 2.7v6.2c0 4.7-3.3 8.6-8 9.8-4.7-1.2-8-5.1-8-9.8V6c1.4-1 4.4-2.7 8-2.7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9.5 12.8V11.3a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M9 12.8h6v4.2H9v-4.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </Icon>
      )
    case 'deploy':
      return (
        <Icon {...common}>
          <path
            d="M4.5 13.5 20 4.2l-4 15.6-4-6.2-7.5-0.1Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M12 13.6 20 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </Icon>
      )
    default:
      return (
        <Icon {...common}>
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
        </Icon>
      )
  }
}

