# KakaoPay Model Context Protocol (MCP)

카카오페이 [Model Context Protocol](https://modelcontextprotocol.com/) 서버는 함수 호출(Function Calling) 방식으로 카카오페이 오픈 API를 연동할 수 있도록 지원합니다. 결제 및 정기결제 등 다양한 카카오페이 기능을 MCP 호스트(Claude, Cursor 등)에서 사용할 수 있습니다.

## 시작하기

### 실행 예시

```bash
# 모든 도구 활성화
npx -y @kakaopay-develop/mcp --tools=all --secret-key=YOUR_KAKAOPAY_SECRET_KEY --cid=TC0ONETIME

# 특정 도구만 활성화
npx -y @kakaopay-develop/mcp --tools=payment.demo,payment.ready --secret-key=YOUR_KAKAOPAY_SECRET_KEY --cid=TC0ONETIME
```

- `YOUR_KAKAOPAY_SECRET_KEY`는 실제 카카오페이 오픈 API 시크릿 키로 교체하세요.
- 시크릿 키는 명령행 인수(`--secret-key`) 또는 환경 변수(`KAKAOPAY_SECRET_KEY`)로 설정할 수 있습니다.
- `cid`는 가맹점 코드로, 명령행 인수(`--cid`)로 설정합니다 (테스트용: TC0ONETIME).

## MCP 호스트(Claude, Cursor 등) 연동 예시

`claude_desktop_config.json` 예시:

```json
{
  "mcpServers": {
    "kakaopay": {
      "command": "npx",
      "args": [
        "-y",
        "@kakaopay-develop/mcp",
        "--tools=all",
        "--cid=TC0ONETIME"
      ],
      "env": {
        "KAKAOPAY_SECRET_KEY": "YOUR_KAKAOPAY_SECRET_KEY"
      }
    }
  }
}
```

## 환경 변수

- `KAKAOPAY_SECRET_KEY`: 카카오페이 오픈 API 시크릿 키

## 명령행 인수

- `--secret-key`: 카카오페이 오픈 API 시크릿 키
- `--cid`: 가맹점 코드 (테스트용: TC0ONETIME)
- `--tools`: 활성화할 도구 목록

## 지원 도구

### 결제 관련 도구

- `payment.demo`: 데모 결제 링크 생성
- `payment.ready`: 결제 준비 요청
- `payment.approve`: 결제 승인 처리
- `payment.cancel`: 결제 취소 처리
- `payment.get`: 결제 상태 조회

### 정기결제 관련 도구

- `subscription.request`: 정기결제 요청
- `subscription.inactive`: 정기결제 비활성화
- `subscription.get`: 정기결제 상태 조회

## 디버깅 및 테스트

[MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)를 활용해 서버를 디버깅할 수 있습니다.

```bash
npx @modelcontextprotocol/inspector node dist/index.js --tools=all --secret-key=YOUR_KAKAOPAY_SECRET_KEY --cid=TC0ONETIME
```

1. `YOUR_KAKAOPAY_SECRET_KEY`를 실제 값으로 교체하세요.
2. `--cid` 인수로 가맹점 코드를 설정하세요 (테스트용: TC0ONETIME).
3. MCP Inspector UI에서 Connect를 눌러 서버를 시작할 수 있습니다.
4. 선택한 도구 목록을 확인하고 각 도구를 테스트할 수 있습니다.

## Best Practice

시크릿 키는 외부에 노출되지 않도록 안전하게 관리하세요.

## 면책 조항(Disclaimer)

`@kakaopay-develop/mcp`는 AI 기반 자동화 도구로, 결과의 정확성이나 완전성을 보장하지 않습니다. 실제 결제 등 중요한 작업 전에는 반드시 별도의 검증을 거치시기 바랍니다. 카카오페이는 본 도구의 사용 결과에 대해 책임지지 않습니다.
