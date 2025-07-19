# 통합 자동화 플랫폼

**자연어로 IT 인프라를 제어하는 LangFlow 기반 통합 자동화 플랫폼**

## 🎯 프로젝트 개요

이 프로젝트는 React, LangFlow, LangGraph, MCP 프로토콜을 통합하여 자연어 기반 IT 인프라 자동화 시스템을 구현합니다. Claude Desktop과 유사한 깔끔한 UI를 제공하며, LangFlow를 통한 동적 워크플로우 생성과 이원화된 LLM 관리 시스템을 특징으로 합니다.

## 🏗️ 아키텍처

### 핵심 기술 스택
- **프론트엔드**: React 18 + TypeScript + Vite
- **백엔드**: FastAPI + LangGraph + LangChain  
- **워크플로우**: LangFlow (비주얼 에디터) + LangGraph (실행 엔진)
- **프로토콜**: MCP (Model Context Protocol) JSON-RPC 2.0
- **LLM**: 이원화 관리 (메인 채팅용 + 워크플로우 노드별)

### 주요 기능
- ✅ 자연어 기반 IT 인프라 제어
- ✅ 실시간 채팅 인터페이스
- ✅ 시각적 워크플로우 에디터 (LangFlow)
- ✅ 장비 관리 및 자동 탐색
- ✅ MCP 서버 통합 관리
- ✅ 이원화된 LLM 시스템

## 📁 프로젝트 구조

```
automation-platform/
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/   # UI 컴포넌트
│   │   ├── hooks/        # 커스텀 훅
│   │   ├── services/     # API 서비스
│   │   ├── stores/       # Zustand 상태
│   │   └── types/        # TypeScript 타입
├── backend/              # FastAPI + LangGraph
│   ├── api/             # API 라우터
│   ├── core/            # 핵심 설정
│   ├── devices/         # 장비 관리 도메인
│   ├── langchain/       # LangChain 통합
│   ├── mcp/             # MCP 프로토콜
│   ├── storage/         # 파일 저장소
│   └── workflow/        # LangGraph 엔진
├── shared/              # 백엔드-프론트엔드 공유 타입
│   └── types/
│       ├── device.ts    # 장비 타입 정의
│       ├── mcp.ts       # MCP 타입 정의
│       ├── workflow.ts  # 워크플로우 타입 정의
│       ├── llm.ts       # LLM 타입 정의
│       └── api.ts       # API 타입 정의
├── langflow_custom/     # 커스텀 LangFlow 컴포넌트
├── docker/             # Docker 설정
├── docs/               # 문서
└── tests/              # 테스트
```

## 🔧 환경 설정

### 필수 요구사항
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose

### 환경 변수 설정
```env
# LLM Providers
ANTHROPIC_API_KEY=your_api_key
OPENAI_API_KEY=your_api_key
GOOGLE_API_KEY=your_api_key

# Storage
STORAGE_PATH=./data

# WebSocket
WS_PORT=8000

# Security
SECRET_KEY=your_secret_key
FERNET_KEY=your_fernet_key
```

### 실행 방법
```bash
# 개발 환경
docker-compose -f docker-compose.dev.yml up

# 프로덕션 환경
docker-compose -f docker-compose.prod.yml up -d
```

## 🚀 주요 특징

### 1. 이원화된 LLM 관리
- **메인 채팅**: Claude 3 Opus (고품질 대화)
- **워크플로우 노드별**: 용도에 최적화된 모델 할당
  - 의도 분석: Claude 3 Haiku (빠른 응답)
  - 계획 생성: Claude 3 Sonnet (논리적 사고)
  - 결과 요약: Claude 3 Haiku (빠른 요약)

### 2. 5단계 고정 워크플로우 + 동적 워크플로우
- **고정 워크플로우**: LangGraph 기반 안정적인 5단계 처리
- **동적 워크플로우**: LangFlow 비주얼 에디터로 사용자 정의

### 3. MCP 프로토콜 통합
- SSH-MCP: 원격 서버 관리
- File-System-MCP: 파일 시스템 작업
- Desktop-Commander-MCP: 시스템 레벨 작업

### 4. 장비 관리 시스템
- 자동 장비 탐색
- 그룹 기반 관리
- 실시간 상태 모니터링

## 📊 현재 진행 상황

### Phase 1: 기반 인프라 (진행 중)
- [x] 프로젝트 구조 설정
- [x] 공유 타입 정의 완성
- [ ] MCP 프로토콜 구현
- [ ] 장비 관리 시스템
- [ ] 파일 기반 저장소

### Phase 2: 워크플로우 엔진 (예정)
- [ ] LangGraph 5단계 워크플로우
- [ ] 이원화된 LLM Manager
- [ ] WebSocket 실시간 통신

### Phase 3: LangFlow 통합 (예정)
- [ ] 커스텀 컴포넌트 개발
- [ ] 워크플로우 템플릿

### Phase 4: React 프론트엔드 (예정)
- [ ] Claude Desktop 스타일 UI
- [ ] 장비 관리 인터페이스
- [ ] 통합 대시보드

## 🔬 타입 안전성

이 프로젝트는 백엔드(Python)와 프론트엔드(TypeScript) 간의 완벽한 타입 안전성을 보장합니다:

- **공유 타입 정의**: `shared/types/` 디렉토리에서 중앙 관리
- **API 인터페이스**: 모든 엔드포인트의 요청/응답 타입 정의
- **WebSocket 이벤트**: 실시간 통신 이벤트 타입 안전성
- **백엔드 검증**: Pydantic 모델과 TypeScript 타입 일치

## 📖 문서

- [기술 설계서](docs/technical-design.md)
- [API 문서](docs/api-reference.md)
- [개발 가이드](docs/development-guide.md)
- [배포 가이드](docs/deployment-guide.md)

## 🤝 기여하기

1. 이 저장소를 Fork 하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 Push 하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 팀

- **개발팀**: IT Easy Operations
- **이메일**: iteasy.ops.dev@gmail.com
- **GitHub**: [@iteasy-ops-dev](https://github.com/iteasy-ops-dev)

---

**⚡ 자연어로 인프라를 제어하는 새로운 경험을 만나보세요!**
