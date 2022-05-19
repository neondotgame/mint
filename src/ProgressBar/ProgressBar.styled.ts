import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  position: relative;
`;

export const Wrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  height: 40px;
  border-radius: 8px;
  overflow: hidden;

  @media (min-width: 567px) {
    height: 250px;
    width: 200px;
    margin-bottom: 10px;
  }
`;

export const Progress = styled.div<{
  redeemedAmount: number;
  availableAmount: number;
}>`
  background: linear-gradient(90deg, #1c3f27, #53a342);
  background: #53a342;
  position: absolute;
  left: -${({ redeemedAmount, availableAmount }) => 100 - (redeemedAmount * 100) / availableAmount}%;
  left: 0;
  width: ${({ redeemedAmount, availableAmount }) =>
    (redeemedAmount * 100) / availableAmount}%;
  height: 100%;

  @media (min-width: 567px) {
    bottom: 0;
    width: 100%;
    height: ${({ redeemedAmount, availableAmount }) =>
      (redeemedAmount * 100) / availableAmount}%;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -20%;
      background: #53a342;
      filter: blur(2px);
      width: 130%;
      height: 30px;
      animation: move 1s infinite alternate;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: -30%;
      background: #53a342;
      filter: blur(2px);
      width: 130%;
      height: 30px;
      animation: move 1s infinite alternate;
    }

    @keyframes move {
      from {
        border-radius: 0;
        top: -5px;
      }
      to {
        border-radius: 40%;
        top: -10px;
      }
    }
  }
`;

export const LoadText = styled.p`
  width: 100%;
  color: #ccc;
  display: flex;
  justify-content: center;
  font-size: 25px;
  align-items: center;
  user-select: none;
  z-index: 1;
`;
