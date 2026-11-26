export type LogoContrastMode = 'native' | 'mono-invert' | 'optical-invert' | 'cvm-boost' | 'dual-asset';

export type PortfolioCategory = 'todos' | 'missao-critica' | 'sob-medida' | 'ia-arquitetura';

export interface AuthorityLogo {
  id: string;
  name: string;
  role: string;
  src: string;
  contrastMode: LogoContrastMode;
  aspect: 'square' | 'wide';
}

export interface PortfolioCase {
  id: string;
  organization: string;
  sector: string;
  category: Exclude<PortfolioCategory, 'todos'>;
  gridSpan: string;
  logo: string;
  logoDark?: string;
  contrastMode: LogoContrastMode;
  aspect: 'square' | 'wide';
  metricValue: string;
  metricNote: string;
  summary: string;
  outcome: string;
  stack: string[];
}

export interface InstitutionalPayload {
  updatedAt: string;
  authorityLogos: AuthorityLogo[];
  cases: PortfolioCase[];
}

export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  checkpoint: string;
  artifactCode: string;
}

export interface ScopeModuleOption {
  id: string;
  title: string;
  domain: string;
  summary: string;
  recommendedStack: string[];
  operationalGain: string;
}
