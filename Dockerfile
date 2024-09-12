# Node.js 20 버전의 기본 이미지를 사용
FROM node:20

# 컨테이너 내에서 /usr/src/app 디렉토리를 작업 디렉토리로 설정
WORKDIR /usr/src/app

# package.json 파일들을 작업 디렉토리로 복사
COPY package*.json ./

# 모든 의존성 설치 (devDependencies 포함)
RUN npm install

# 애플리케이션 소스 파일들을 작업 디렉토리로 복사
COPY . .

# NestJS 빌드 (production 환경에서 필요한 경우)
RUN npm run build

# devDependencies 제거 (프로덕션 환경에만 필요한 경우)
RUN npm prune --omit=dev

# 컨테이너가 노출할 포트
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "run", "start:prod"]