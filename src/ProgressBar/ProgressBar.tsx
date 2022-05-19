import * as Styled from './ProgressBar.styled';

interface ProgressBarProps {
  redeemedAmount: number;
  availableAmount: number;
}

export const ProgressBar = ({
  redeemedAmount,
  availableAmount,
}: ProgressBarProps) => {
  return (
    <Styled.Container>
      <Styled.Wrapper>
        <Styled.LoadText>
          {redeemedAmount} / {availableAmount}
        </Styled.LoadText>
        <Styled.Progress
          redeemedAmount={redeemedAmount}
          availableAmount={availableAmount}
        />
      </Styled.Wrapper>
    </Styled.Container>
  );
};
