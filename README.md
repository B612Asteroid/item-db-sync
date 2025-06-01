## 📦 프로젝트 개요

"데이터 싱크 서버"
- 이 서비스는 원본 시스템에서 데이터를 읽어와 목적지 DB로 정제/적재하는 하향식 데이터 싱크를 담당합니다.

## 🧠 설계 철학 요약

- 이 프로젝트는 단순 마이그레이션을 넘어, "도메인 기반 확장", "트랜잭션 안정성", "의존성 명확화"를 중심 가치로 설계되었습니다.
- 모든 비즈니스 로직은 **Service**, 모든 흐름 제어는 **Orchestrator**, 트리거는 **Controller 또는 Scheduler**에서 담당합니다.

## 📁 폴더 구조

```plaintext
src/
├── app/
│   ├── item/               # 아이템 도메인
│   │   ├── base/               # 공통 엔티티 (추상 ViewEntity)
│   │   ├── source/             # 원본 DB 기반 실체
│   │   ├── sync/               # 동기화 DB 대상 실체
│   │   ├── item.module.ts
│   │   ├── item.service.ts
│   │   └── item.controller.ts
│   ├── file/            # 첨부파일 도메인
│   │   └── ...
├── config/
│   ├── datasource/            # DataSource 설정
│   └── logger/                # Pino 기반 Logger 설정
├── scheduler/                 # NestJS Scheduler Cron
└── main.ts
```

## ⚙️ 주요 기술 스택
- NestJS + TypeORM
- 멀티 DB 구성 (Source / Sync)
- 스케쥴 기반 마이그레이션
- Logger (nestjs-pino)
- 테스트 분리 가능 구조
- 날짜 관리 (dayjs)

## 🔧 실행 방법

```shell
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run start

```

## ➡️ 흐름도
```plaintext
[Controller or CRON]
      ↓
[Orchestrator]
      ↓      (transactional)
[EntityManager]
      ↓
[Service.save(manager, entities)]
```

## 🚀 작업 방법
1. 새로 도메인 추가 시 다음 명령어를 사용합니다.
```shell
npm run scaffold [도메인명]
```
   - 명령어 사용 시 다음과 같이 폴더구조가 생성됩니다.
```plainText
📂 app/
└── 📁 mydomain/
    ├── base/
    │   └── mydomain.base.entity.ts
    ├── source/
    │   └── mydomain.source.entity.ts
    ├── sync/
    │   └── mydomain.sync.entity.ts
    ├── mydomain.module.ts
    ├── mydomain.service.ts
    └── mydomain.controller.ts
```
2. sh 실행 시, 자동으로 루트 폴더 / base/ source/ sync/ 폴더가 생성됩니다.
3. base 폴더에 [도메인].base.entity.ts를 생성합니다.
    - baseEntity는 abstract이어야 하며, `@Entity`를 가지지 않습니다.
4. source 폴더에 [도메인].source.entity.ts를 생성합니다.
    - sourceEntity는 `@ViewEntity`여야 합니다.
    - 방금 만든 baseEntity를 상속하며, 빈 클래스여도 동작합니다.
5. sync 폴더에 [도메인].sync.entity.ts를 생성합니다.
    - syncEntity는 `@Entity`여야 합니다.
    - 방금 만든 baseEntity를 상속하며, 빈 클래스여도 동작합니다.
6. 서비스를 작성합니다.
    - 서비스 주입은 다음과 같이 진행합니다.
```typescript
constructor(
    // #. 원본 View에 접근하기 위한 dataSource
    @Inject("SOURCE_DATASOURCE")
    private readonly sourceDataSource: DataSource,

    // #. 목적지 Table에 접근하기 위한 dataSource
    @Inject("SYNC_DATASOURCE")
    private readonly syncDataSource: DataSource,
) {}

// #. 실제 메소드 내부에서 다음과 같이 호출하여 Repository를 만들 수 있습니다.
const sourceFileRepository = this.sourceDataSource.getRepository(SourceFile);
```
7. save 메소드인 경우 EntityManager를 첫 번째 파라미터로 받아야 합니다.
   - entityManager 주입 이유는 트랜잭션 관리를 위하여입니다.
   - 8. 오케스트레이터에서 다시 설명합니다.
8. 오케스트레이터 클래스를 생성합니다. 
   - 서비스에서는 조회 / 저장만, 실제 마이그레이션 코드는 오케스트레이터 클래스에서 진행합니다.
```typescript
import { transactional } from "src/utils/transactional";
await transactional(this.syncDataSource, async (manager: EntityManager) => {}
```
   - 오케스트레이터 내부에서는 다음과 같이 util로부터 transactional을 받아와, entityManager를 각 서비스에 주입하여야 합니다.
9. [도메인].module.ts에 다음과 같이 주입합니다.
```typescript
@Module({
    controllers: [ItemController],
    // #. 내부에서 DI를 진행할 때 사용
    providers: [ItemService, ItemSyncOrchestrator],
    // #. 도메인 외부로 DI를 진행할 때 사용
    exports: [ItemSyncOrchestrator, ItemService],
    imports: [DatabaseModule],
})
export class ItemModule {}
```
9. 자세한 내용은 만들어진 Item, File 폴더를 참고합니다.

## 🚀 마이그레이션 실행

1. CRON 기반 자동 실행 (예: 1시간 주기)
2. API 호출 기반 수동 트리거
    - 예: `POST /item/migrate/:id`

동작 방식은 Orchestrator를 통해 처리됩니다.

## 📌 첨부파일은 독립적인 도메인이 아닌, 주도 도메인(Persistable)에 종속된 유틸 도메인입니다.
- 별도 Orchestrator/Controller는 존재하지 않는다.
- service는 도메인 간 재사용 가능하지만, 반드시 주도 도메인을 통해서만 사용되어야 한다.

## ecosystem.config
- PM2 실행 시 env.[ENV] 를 주입하면 env 파일을 자동으로 읽어 DB 정보를 가져옵니다.
- 예시) .env.sourcedb 로 했을 경우 ecosystem.config.js에 NODE_ENV: "sourcedb"로 주입하면 됩니다.

## 🧪 테스트 전략
- 도메인 별 서비스 단위 테스트 가능 구조
- 트랜잭션 단위로 테스트 격리