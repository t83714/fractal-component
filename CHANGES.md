## 3.2.3

- Fixed: avoid using toString to convert action type in effects

## 3.2.2

-   Moved `symbolToString` to `utils`. Fixed remaining symbol.toString issue for UMD version

## 3.2.1

-   Fixed: avoid symbol.toString to be coverted to ""+ by minifier

## 3.2.0

-   Won't include redux-saga in bundle anymore to avoid UMD version usage issue
-   Reduced bundle size check to 15K
-   Upgrade redux-saga to 1.0.0-beta.2
-   Not rely on redux-saga.is anymore so that UMD version doesn't require another script

## 3.1.2

-   Fixed UMD version reported `process` is undefined
-   Not include `redux-saga` in distribution bundle anymore to avoid UMD use case issue
-   Remove dependency on `@redux-saga/is`
