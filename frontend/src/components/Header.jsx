import projectLogo from '../assets/project-logo.png'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <img
          className="header-logo-img"
          src={projectLogo}
          alt="DevSecOps project logo"
        />
        <div className="header-text">
          <h1>DevSecOps Pipeline Dashboard</h1>
          <p>Secure CI/CD pipeline with automated vulnerability scanning and security gates</p>
        </div>
      </div>
    </header>
  )
}
