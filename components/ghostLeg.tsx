"use client";

import { FC, useEffect, useRef, useState } from "react";
import { UserInput } from "@/components/userInput";
import { AnimalButtons } from "@/components/AnimalButton";
import { Animal } from "@/src/data/ghost_leg";

export const GhostLeg: FC = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [userNum, setUserNum] = useState<number>(2);
  const [containerPixel, setContainerPixel] = useState<number>(100);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null); // 백그라운드 캔버스
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null); // 사다리 타기 라인 캔버스
  const [isStart, setIsStart] = useState(false);
  const [nagi, setNagi] = useState<{ [key: number]: string }>({});
  const [ghostLeg, setGhostLeg] = useState<number[][]>([]);
  const animals = useRef<Animal[]>([]);

  const [basicImages, setBasicImages] = useState<CanvasImageSource>();
  // 이전 포그라운드 캔버스
  const [prevFgCanvas, setPrevFgCanvas] = useState<HTMLCanvasElement | null>(
    null
  );

  const [targetAnimal, setTargetAnimal] = useState<number | null>(null);

  useEffect(() => {
    setDomLoaded(true);

    // 기본 이미지 불러오기
    loadImage("/images/sprite_junis_small_v4.png").then((result) =>
      setBasicImages(result)
    );
  }, []);

  /**
   * 인원 수 변경
   */
  useEffect(() => {
    // 내기 설정
    for (let i = 0; i < userNum; i++) {
      if (!nagi[i]) {
        nagi[i] = "";
      }
    }

    setTargetAnimal(null); // 타겟 초기화
    setIsStart(false); // 시작 초기화
    setPrevFgCanvas(null); // 이전 포그라운드 캔버스 초기화
    // 유저 수와 동일한 동물 데이터 세팅
    animals.current = Array.from({ length: userNum }, (_, idx) => ({
      y: 0,
      x: idx,
    }));
    drawBaseImages(); // 동물, 동물 그림자, 번호 그리기
  }, [userNum]);

  /**
   * 사다리 게임 시작. 사다리 그리기
   */
  useEffect(() => {
    if (isStart) {
      drawGhostLegLine();
    }
  }, [isStart]);

  /**
   * 이미지 로드
   * @param src
   */
  const loadImage = (src: string) => {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  /**
   * 동물 이미지, 동물 그림자, 번호 이미지 등 기본 이미지 그리기
   */
  const drawBaseImages = (drawLineCb: (() => void) | null = null) => {
    drawAnimalShadowAndNumbers(); // 백그라운드에 동물 그림자, 숫자 그리기
    drawAnimals(); // 포그라운드에 동물 아이콘 그리기

    // 사다리 선 그리는 콜백 함수 존재 시 호출
    if (drawLineCb) {
      drawLineCb();
    }
  };

  /**
   * 백그라운드 캔버스에 동물 그림자, 숫자 그리기
   */
  const drawAnimalShadowAndNumbers = () => {
    // 백그라운드 캔버스 설정
    const bgCanvas = bgCanvasRef.current;

    if (bgCanvas) {
      const bgCtx = bgCanvas.getContext("2d")!;

      /*
        캔버스 위에 그림을 그리고 나서 새로고침되기 전에 깜빡거림을 줄이기 위해 오프스크린 캔버스 사용.
        오프스크린 캔버스에 먼저 그린 후 원본 캔버스에 옮겨준다.
      */
      const bgOffCanvas = document.createElement("canvas"); // 백그라운드 오프스크린 캔버스 생성
      bgOffCanvas.width = bgCanvas.width;
      bgOffCanvas.height = bgCanvas.height;
      const bgOffCtx = bgOffCanvas.getContext("2d");

      const animalAndNumberIcons = basicImages; // 이미지 데이터 가져오기
      if (bgOffCtx && animalAndNumberIcons) {
        bgOffCtx.clearRect(0, 0, bgOffCanvas.width, bgOffCanvas.height); // 백그라운드 오프스크린 캔버스 초기화
        // 고해상도를 위해 캔버스 크기 조정
        // const dpr = window.devicePixelRatio || 1; // 디바이스 픽셀 비율 확인
        // 캔버스의 실제 해상도를 높이기
        bgCanvas.width = 600;
        bgCanvas.height = 308;

        const cropX = 0; // 이미지 크롭 시작 x 좌표
        const cropY = 0; // 이미지 크롭 시작 y 좌표
        const cropWidth = 50 * userNum; // 이미지 크롭 너비
        const cropHeight = 50; // 이미지 크롭 높이
        const canvasX = 0; // 이미지를 그릴 canvas 의 x 좌표
        const canvasY = 0; // 이미지를 그릴 canvas 의 y 좌표
        const destWidth = 50 * userNum;
        const destHeight = 50;

        // 백그라운드에 동물 그림자 아이콘 그리기
        bgOffCtx.drawImage(
          animalAndNumberIcons,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          canvasX,
          canvasY,
          destWidth,
          destHeight
        );

        // 백그라운드에 숫자 아이콘 그리기
        bgOffCtx.drawImage(
          animalAndNumberIcons,
          cropX,
          cropY + 100,
          cropWidth,
          cropHeight,
          0,
          bgCanvas.height - 50,
          destWidth,
          destHeight
        );
        // 백그라운드 캔버스 초기화 후, 백그라운드 오프캔버스를 백그라운드 캔버스에 옮김
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.drawImage(bgOffCanvas, 0, 0);
      }
    }
  };

  /**
   * 포그라운드에 동물 이미지 그리기
   */
  const drawAnimals = () => {
    const fgCanvas = fgCanvasRef.current;

    if (fgCanvas) {
      const fgCtx = fgCanvas.getContext("2d")!;

      const fgOffCanvas = document.createElement("canvas"); // 포그라운드 오프스크린 캔버스 생성
      fgOffCanvas.width = fgCanvas.width;
      fgOffCanvas.height = fgCanvas.height;
      const fgOffCtx = fgOffCanvas.getContext("2d");

      // 캔버스의 실제 해상도를 높이기
      fgCanvas.width = 600;
      fgCanvas.height = 308;

      const cropX = 50; // 원본 이미지 크롭 시작 x 좌표
      const cropY = 50; // 원본 이미지 크롭 시작 y 좌표
      const cropWidth = 50; // 원본 이미지 크롭 너비
      const cropHeight = 50; // 원본 이미지 크롭 높이
      const canvasX = 50; // 크롭한 이미지를 그릴 캔버스의 x 좌표
      const canvasY = 0; // 크롭한 이미지를 그릴 캔버스의 y 좌표
      const destWidth = 50; // 캔버스에서 출력할 너비 (원본 비율 유지 가능)
      const destHeight = 50; // 캔버스에서 출력할 높이 (원본 비율 유지 가능)

      if (fgOffCtx) {
        const animalAndNumberIcons = basicImages;

        if (animalAndNumberIcons) {
          // 포그라운드에 동물 아이콘 그리기
          animals.current.forEach((animal) => {
            fgOffCtx.drawImage(
              animalAndNumberIcons,
              cropX * animal.x,
              cropY,
              cropWidth,
              cropHeight,
              canvasX * animal.x,
              canvasY,
              destWidth,
              destHeight
            );
          });

          // 포그라운드 캔버스 초기화 후, 포그라운드 오프캔버스를 포그라운드 캔버스에 옮김
          // fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
          fgCtx.drawImage(fgOffCanvas, 0, 0);
        }
      }
    }
  };

  /**
   * 랜덤으로 사다리 배열 만들기
   */
  const makeRandomGhostLeg = () => {
    const ghostLegArr: number[][] = []; // 사다리 배열
    const firstAndLastEl = Array.from({ length: userNum }, () => 0); // 사다리의 배열의 처음과 마지막 행

    // 처음과 마지막 행 세팅
    ghostLegArr.push(firstAndLastEl);
    ghostLegArr.push(firstAndLastEl);

    // 각 배열 어느 인덱스에 1 이 들어갈껀지 세팅, 총 7개 행
    Array.from({ length: 7 }).forEach(() => {
      // 최대로 들어갈 수 있는 1의 갯수.
      // 예) 유저수 6, ceil = (6-1)/2 = 3
      const ceil = Math.ceil((userNum - 1) / 2);
      // 현재 들어가 있는 1의 개수
      let count = 0;
      // 랜덤으로 정해진 최대 1의 갯수
      let limitCnt;

      if (userNum == 2) {
        limitCnt = Math.round(Math.random() * ceil);
      } else if (userNum == 3 || userNum == 4) {
        limitCnt = Math.ceil(Math.random() * ceil); // 사다리가 1개는 존재할 수 있도록 올림 설정
      } else {
        limitCnt = ceil;
      }

      // (유저수 - 1) 의 길이를 가진 배열 생성. 예) [0, 0, 0, 0, 0]
      const currentArr = Array.from({ length: userNum - 1 }, () => 0);

      // 인덱스 리스트 설정. 예) [0, 1, 2, 3, 4]
      const positions = Array.from({ length: userNum - 1 }, () => 0).map(
        (_, idx) => {
          return idx;
        }
      );

      // 인덱스를 무작위로 섞음. 예) positions = [1, 4, 0, 2, 3]
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      for (const pos of positions) {
        // 현재 위치의 값이 1이면 스킵
        if (currentArr[pos] === 1) continue;

        // 1을 배치할 수 있는 조건 확인
        const isFirstOrNextZero = pos === 0 && currentArr[pos + 1] === 0;
        const isLastOrPrevZero =
          pos === userNum - 2 && currentArr[pos - 1] === 0;
        const isSurroundedByZero =
          currentArr[pos - 1] === 0 && currentArr[pos + 1] === 0;

        if (
          (isFirstOrNextZero || isLastOrPrevZero || isSurroundedByZero) &&
          count < limitCnt
        ) {
          currentArr[pos] = 1;
          count++;
        }

        // 필요한 1의 개수를 초과하면 루프 종료
        if (count >= limitCnt) break;
      }

      currentArr.push(0);
      ghostLegArr.splice(1, 0, currentArr);
    });
    return ghostLegArr;
  };

  const validateGhostLeg = (currentGhostLeg: number[][]) => {
    let result = true;

    /**
     * 타겟이 사다리를 따라 이동
     * @param currentY - 타겟의 현재 Y 좌표
     * @param currentX - 타겟의 현재 X 좌표
     */
    const moveTarget = (currentY: number, currentX: number) => {
      let newY = currentY;
      let newX = currentX;

      // 현재 좌표의 값이 1이고, 오른쪽으로 한칸 이동 후, 아래로 한칸 이동
      if (currentGhostLeg[currentY][currentX] === 1) {
        newY++;
        newX++;
      }
      // 이전 x 좌표값이 1인경우, 왼쪽으로 한칸 이동 후, 아래로 한칸 이동
      else if (currentGhostLeg[currentY][currentX - 1] === 1) {
        newY++;
        newX--;
      }
      // 현재 좌표의 값이 0 인 경우, 아래로 한칸 이동
      else if (currentGhostLeg[currentY][currentX] === 0) {
        newY++;
      }

      if (newY !== 8) {
        return moveTarget(newY, newX);
      } else {
        return [newY, newX];
      }
    };

    if (targetAnimal !== null) {
      const resultYX = moveTarget(0, targetAnimal); // 타겟이 도착한 [y,x] 좌표

      // 타겟의 x 좌표가 1 이 아닐 경우, 유효하지 않다고 판단, result 에 false 세팅
      if (resultYX[1] !== 1) {
        result = false;
      }
    }

    return result;
  };

  /**
   * 사다리 배열에 맞춰 사다리 기본선 그리기
   */
  const drawGhostLegLine = () => {
    const drawBaseGhostLeg = async (
      userIdx: number,
      ghostLegArray: number[][]
    ) => {
      const bgCanvas = bgCanvasRef.current;

      if (bgCanvas) {
        const bgCtx = bgCanvas.getContext("2d")!;
        // 선 스타일 설정
        bgCtx.strokeStyle = "lightgrey"; // 선 색상
        bgCtx.lineWidth = 5; // 선 두께

        const startX = 25 + userIdx * 50; // 사다리 시작 x 좌표
        const defaultStartY = 40; // 기본 사다리 시작 y 좌표
        const lineGap = 28; // 수평 사다리 사이 높이

        /* 수직선 그리기 */
        bgCtx.beginPath(); // 경로 시작
        bgCtx.moveTo(startX, 50); // 시작점 좌표 (x, y)
        bgCtx.lineTo(startX, 260); // 끝점 좌표 (x, y)
        bgCtx.stroke(); // 선 그리기
        bgCtx.closePath(); // 경로 닫기

        /* 사다리 수평선 그리기 */
        for (
          let ghostLegIdx = 0;
          ghostLegIdx < ghostLegArray.length - 1;
          ghostLegIdx++
        ) {
          // 현재 user Index 에서 이어져 있는 수평선이 있을 경우
          if (ghostLegArray[ghostLegIdx][userIdx] == 1) {
            bgCtx.beginPath(); // 경로 시작
            bgCtx.moveTo(startX, defaultStartY + ghostLegIdx * lineGap); // 시작점 좌표 (x, y)
            bgCtx.lineTo(startX + 50, defaultStartY + ghostLegIdx * lineGap); // 끝점 좌표 (x, y)
            bgCtx.stroke(); // 선 그리기
            bgCtx.closePath(); // 경로 닫기
          }
        }
      }
    };

    const canvas = fgCanvasRef.current;

    if (canvas) {
      let ghostLegArray = makeRandomGhostLeg(); // 랜덤 사다리 배열 만들기

      // 타겟이 존재 시, 유효하지 않은 배열이면 유효한 배열이 될 때까지 사다리 배열 재생성
      if (targetAnimal) {
        while (!validateGhostLeg(ghostLegArray)) {
          ghostLegArray = makeRandomGhostLeg();
        }
      }

      setGhostLeg(ghostLegArray); // 사다리 상태 저장

      // 사다리 그리기
      new Array(userNum)
        .fill(1)
        .map((_, userIdx) => drawBaseGhostLeg(userIdx, ghostLegArray));
    }
  };

  /**
   * 동물 클릭해 사다리 타기 시작
   * @param {number} initialAnimalY - 동물이 처음 위치한 Y 좌표
   * @param {number} initialAnimalX - 동물이 처음 위치한 X 좌표
   */
  const clickAnimal = (initialAnimalY: number, initialAnimalX: number) => {
    /**
     * 재귀를 통해 동물 이동
     * @param currentAnimalY - 움직이기 전 동물의 Y 좌표
     * @param currentAnimalX - 움직이기 전 동물의 X 좌표
     */
    const move = async (currentAnimalY: number, currentAnimalX: number) => {
      let newAnimalX = currentAnimalX;
      let newAnimalY = currentAnimalY;

      // 현재 좌표의 값이 1이고, 오른쪽으로 한칸 이동 후, 아래로 한칸 이동
      if (ghostLeg[currentAnimalY][currentAnimalX] === 1) {
        newAnimalX++;
        newAnimalY++;
      }
      // 이전 x 좌표값이 1인경우, 왼쪽으로 한칸 이동 후, 아래로 한칸 이동
      else if (ghostLeg[currentAnimalY][currentAnimalX - 1] === 1) {
        newAnimalX--;
        newAnimalY++;
      }
      // 현재 좌표의 값이 0 인 경우, 아래로 한칸 이동
      else if (ghostLeg[currentAnimalY][currentAnimalX] === 0) {
        newAnimalY++;
      }

      // 기존 좌표에서 이동할 좌표로 사다리를 타고 이동하는 동물 그리기
      await drawMovingLine(
        currentAnimalY,
        currentAnimalX,
        newAnimalY,
        newAnimalX,
        initialAnimalX
      );

      // 마지막 행일 때까지 재귀호출
      if (newAnimalY !== 8) {
        await move(newAnimalY, newAnimalX);
      }
    };

    const fgCanvas = fgCanvasRef.current;

    if (fgCanvas) {
      const fgCtx = fgCanvas.getContext("2d")!;

      // 포그라운드 오프 캔버스 생성
      const fgOffCanvas = document.createElement("canvas");
      fgOffCanvas.width = fgCanvas.width;
      fgOffCanvas.height = fgCanvas.height;
      const fgOffCtx = fgOffCanvas.getContext("2d");

      // 이전 포그라운드 캔버스가 존재할 시
      if (prevFgCanvas) {
        fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height); // 포그라운드 캔버스를 초기화
        fgCtx.drawImage(prevFgCanvas, 0, 0); // 이전 포그라운드 캔버스를 다시 그림
      }

      // 포그라운드 오프 캔버스에 현재 캔버스 저장 후, preFgCanvas 에 저장
      if (fgOffCtx) {
        fgOffCtx.clearRect(0, 0, fgOffCanvas.width, fgOffCanvas.height); // 오프스크린 캔버스 초기화
        fgOffCtx.drawImage(fgCanvas, 0, 0);
        setPrevFgCanvas(fgOffCanvas); // 이전 포그라운드 캔버스 저장
      }

      move(initialAnimalY, initialAnimalX);
    }
  };

  /**
   * 다시하기 버튼 클릭 시, 사다리 다시 그림
   */
  const reDrawGhostReg = () => {
    setPrevFgCanvas(null); // 이전 포그라운드 캔버스 초기화
    drawBaseImages(drawGhostLegLine); // 기본 이미지 및 사다리 선 다시 그림
  };

  /**
   * 시작점 movingStartX, movingStartY 로 시작해서,
   * 종착점 movingEndY, movingEndX 로 움직이는 사다리 라인 그리기
   * @param movingStartY - 움직이기 전 동물의 Y 좌표
   * @param movingStartX - 움직이기 전 동물의 X 좌표
   * @param movingEndY - 동물이 이동할 Y 좌표
   * @param movingEndX - 동물이 이동할 X 좌표
   * @param initialAnimalX - 동물의 초기 X 좌표
   */
  const drawMovingLine = async (
    movingStartY: number,
    movingStartX: number,
    movingEndY: number,
    movingEndX: number,
    initialAnimalX: number
  ) => {
    /**
     * Canvas 수평이동
     * @param startX - 동물이 움직이기 시작할 때의 Canvas X 좌표
     * @param startY - 동물이 움직이기 시작할 때의 Canvas Y 좌표
     * @param endX - 동물이 도착할 Canvas X 좌표
     */
    const drawLineX = (startX: number, startY: number, endX: number) => {
      const fgCanvas = fgCanvasRef.current;

      if (fgCanvas) {
        const fgCtx = fgCanvas.getContext("2d")!;

        let currentX = startX; // 현재 X 좌표 (애니메이션 진행 상태)
        return new Promise((resolve) => {
          const speed = 10; // 속도를 조정하려면 이 값을 변경

          const animate = () => {
            // 이미지 그리기
            const imgWidth = 50; // 이미지 너비
            const imgHeight = 50; // 이미지 높이
            const imgX = currentX - imgWidth / 2; // 이미지의 중심이 선 끝에 오도록 조정
            const imgY = startY - imgHeight / 2; // 이미지의 중심이 선 끝에 오도록 조정

            // fgCtx.drawImage(
            //   image, // 이미지
            //   initialAnimalX * 50, // 이미지 크롭 시작 x 좌표
            //   50, // 이미지 크롭 시작 y 좌표
            //   50, // 이미지 크롭 너비
            //   50, // 이미지 크롭 높이
            //   imgX, // 이미지를 그릴 canvas 의 x 좌표
            //   imgY, // 이미지를 그릴 canvas 의 y 좌표
            //   imgWidth, // 이미지 너비
            //   imgHeight // 이미지 높이
            // );

            // animals.current[initialAnimalX].x = currentX;
            // drawAnimals();

            fgCtx.beginPath(); // 경로 시작
            fgCtx.moveTo(startX, startY); // 시작점 좌표 (x, y)
            fgCtx.lineTo(currentX, startY); // 끝점 좌표 (x, y) 횡이동
            fgCtx.stroke(); // 선 그리기
            fgCtx.closePath(); // 경로 닫기

            if (currentX !== endX) {
              if (currentX < endX) {
                currentX += Math.min(speed, endX - currentX); // 오른쪽으로 확장
              } else {
                currentX -= Math.min(speed, currentX - endX); // 왼쪽으로 축소
              }
              requestAnimationFrame(animate); // 다음 프레임 요청
            } else {
              resolve(true); // 횡 이동 완료 시 Promise 해결
            }
          };

          const image = new Image();
          image.src = "/images/sprite_junis_small_v4.png"; // 이미지 경로
          image.onload = () => {
            // 이미지가 로드된 후 애니메이션 시작
            animate();
          };
        });
      }
    };

    /**
     * 수직이동
     * @param startY - 동물이 움직이기 시작할 때의 Canvas Y 좌표
     * @param endY - 동물이 도착할 Canvas Y 좌표
     * @param endX - 동물이 도착할 Canvas X 좌표
     */
    const drawLineY = (startY: number, endY: number, endX: number) => {
      const fgCanvas = fgCanvasRef.current;

      if (fgCanvas) {
        const fgCtx = fgCanvas.getContext("2d")!;

        let currentY = startY; // 현재 Y 좌표 (애니메이션 진행 상태)
        return new Promise((resolve) => {
          const speed = 5; // 속도를 조정하려면 이 값을 변경

          const animate = () => {
            if (currentY !== endY) {
              fgCtx.beginPath(); // 경로 시작
              fgCtx.moveTo(endX, currentY - 3); // 이전 프레임의 위치

              // 다음 위치로 선을 그림
              if (currentY < endY) {
                currentY += Math.min(speed, endY - currentY);
              } else {
                currentY -= Math.min(speed, currentY - endY);
              }

              fgCtx.lineTo(endX, currentY); // 현재 프레임 위치로 선을 그림
              fgCtx.stroke(); // 선 그리기
              fgCtx.closePath(); // 경로 닫기

              requestAnimationFrame(animate); // 다음 프레임 요청
            } else {
              resolve(true); // 애니메이션 종료
            }
          };

          animate();
        });
      }
    };

    const fgCanvas = fgCanvasRef.current;

    if (fgCanvas && isStart) {
      const fgCtx = fgCanvas.getContext("2d")!;
      fgCtx.strokeStyle = "yellow"; // 선 색상 설정
      fgCtx.lineWidth = 5; // 선 두께 설정

      const defaultStartY = 40; // 기본 사다리 시작 Canvas Y 좌표
      const defaultStartX = 25; // 기본 사다리 시작 Canvas X 좌표

      /*
        동물이 움직이기 시작할 때의 Canvas Y 좌표
        시작점일 경우, y 좌표 +10 보정
      */
      const startY =
        movingStartY === 0
          ? defaultStartY + 28 * movingStartY + 10
          : defaultStartY + 28 * movingStartY;
      const startX = defaultStartX + movingStartX * 50; // 동물이 움직이기 시작할 때의 Canvas X 좌표

      const endY = defaultStartY + 28 * movingEndY + 3; //  동물이 도착할 Canvas Y 좌표
      const endX = defaultStartX + movingEndX * 50; // 동물이 도착할 Canvas X 좌표

      await drawLineX(startX, startY, endX); // 시작 Canvas X 좌표에서 도착 Canvas X 좌표로 이동
      await drawLineY(startY, endY, endX); // 시작 Canvas Y 좌표에서 도착 Canvas Y 좌표로 이동
    }
  };

  /**
   * 타겟 세팅
   * @param animalX
   */
  const handleTarget = (animalX: number) => {
    setTargetAnimal((prevState) => (prevState ? null : animalX));
  };

  /**
   * 유저수 증가
   */
  const increaseUser = () => {
    setUserNum((prevState) => (prevState >= 12 ? prevState : prevState + 1));
    if (userNum < 12) {
      setContainerPixel((prevState) => prevState + 50);
    }
  };

  /**
   * 유저수 감소
   */
  const decreaseUser = () => {
    setUserNum((prevState) => (prevState <= 2 ? prevState : prevState - 1));

    if (userNum > 2) {
      setContainerPixel((prevState) => prevState - 50);
    }
  };

  return (
    <div>
      {domLoaded && (
        <div>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://ssl.pstatic.net/sstatic/keypage/outside/scui/mobilegame/css/mcs_mgame_230922.css"
          />

          <section id="portal" className="sc cs_mgame" data-dss-logarea="xmg">
            <div className="api_subject_bx">
              <div className="api_title_area">
                <h2 className="api_title">사다리게임</h2>
              </div>
              <div className="csu_hh">
                <div className="gm_wrp">
                  <div className="cntrl_area">
                    <h3 className="hc">참여 인원수</h3>
                    <span className="prsn_num">
                      <span className="people_num">인원수</span>
                      <em>
                        <span>{userNum}</span>명
                      </em>{" "}
                      <button
                        type="button"
                        className="mns"
                        onClick={() => {
                          decreaseUser();
                        }}
                      >
                        빼기
                      </button>{" "}
                      <button
                        type="button"
                        className="pls"
                        onClick={() => {
                          increaseUser();
                        }}
                      >
                        더하기
                      </button>{" "}
                    </span>{" "}
                    <p className="ifm">
                      {targetAnimal
                        ? "(최소2명~최대12명)."
                        : "(최소2명~최대12명)"}
                    </p>
                  </div>
                  <div
                    className="canvas_area"
                    style={{ backgroundSize: "auto", textAlign: "center" }}
                  >
                    <h4 className="hc">사다리 영역</h4>
                    <div
                      className="situation"
                      style={{
                        display: "inline",
                      }}
                    >
                      {isStart ? (
                        <p>동물을 클릭하여 결과를 확인하세요.</p>
                      ) : (
                        <p>각자 동물을 선택하고 사다리를 타보세요.</p>
                      )}{" "}
                      <a
                        href="#"
                        className="game_start"
                        style={{ display: isStart ? "none" : "inline" }}
                        onClick={() => setIsStart(true)}
                      >
                        사다리 타기 시작하기
                      </a>
                    </div>
                    <div
                      className="scrollview _jmc_no_tap_highlight_"
                      style={{
                        height: "308px",
                        marginBottom: "5px",
                        overflow: "hidden",
                        position: "relative",
                        display: "block",
                      }}
                    >
                      <div
                        className="scroller"
                        style={{
                          position: "absolute",
                          zIndex: 1,
                          left: "0px",
                          top: "0px",
                          // transitionProperty, -webkit-transform; transform: translate(0px, 0px),
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <div
                          className="_canvasContainer"
                          style={{
                            position: "relative",
                            margin: "0px auto",
                            left: "0px",
                            width: `${containerPixel}px`,
                            height: "308px",
                          }}
                        >
                          <canvas
                            className="_bgCanvasPane"
                            ref={bgCanvasRef}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              zIndex: 100,
                              width: "600px",
                              height: "308px",
                            }}
                          ></canvas>
                          <canvas
                            className="_fgCanvasPane"
                            ref={fgCanvasRef}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              zIndex: 110,
                              width: "600px",
                              height: "308px",
                            }}
                          ></canvas>
                          <div
                            className="_eventPane"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              background: "#fff",
                              opacity: 0,
                              zIndex: 120,
                            }}
                          >
                            <AnimalButtons
                              userNum={userNum}
                              moveAnimal={(
                                animalY: number,
                                animalX: number
                              ) => {
                                if (isStart) {
                                  clickAnimal(animalY, animalX);
                                } else {
                                  handleTarget(animalX);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="paginate">
                        <a
                          href={"#"}
                          className="pre"
                          style={{ display: "none" }}
                        >
                          이전화전
                        </a>{" "}
                        <a
                          href="#"
                          className="next"
                          style={{ display: "none" }}
                        >
                          다음화면
                        </a>
                      </div>
                    </div>
                    <div
                      className="result_area"
                      style={{ display: isStart ? "inline" : "none" }}
                    ></div>
                    <div
                      className="cntrol_btn"
                      style={{ display: isStart ? "inline" : "none" }}
                    >
                      <button type="button" className="relt">
                        결과보기
                      </button>
                      <button
                        type="button"
                        className="again"
                        onClick={() => {
                          reDrawGhostReg();
                        }}
                      >
                        다시하기
                      </button>
                    </div>
                  </div>
                  <div className="cntrl_frm">
                    <h4>내기설정</h4>
                    <UserInput
                      userNum={userNum}
                      nagi={nagi}
                      setNagi={setNagi}
                    />
                  </div>
                </div>
                <div className="spe_slc">
                  <span className="other_info">다른 게임</span>
                  <div className="slc_w">
                    <select className="slc">
                      <option value="">선택하세요</option>
                      <option>가위바위보 게임</option>
                      <option>당첨자 추첨</option>
                      <option>원판돌리기</option>
                      <option>주사위 굴리기</option>
                      <option>제비뽑기</option>
                      <option>화살표돌리기</option>
                      <option>간단게임모음</option>
                    </select>
                  </div>
                </div>
                <script type="text/template" className="_tmplLadderEventPane">
                  <a
                    href="#"
                    className="_avatar"
                    data-idx="{=nIndex}"
                    style={{ display: "inline-block" }}
                  ></a>
                </script>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
