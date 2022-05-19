import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 20px 10px;

  @media (min-width: 567px) {
    width: 100%;
    max-width: 800px;
    padding: 100px 30px;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  @media (min-width: 567px) {
    margin-bottom: 40px;
  }
`;

export const Title = styled.h1`
  font-size: calc(18px + 1.5vw);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: Iceland;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 5px #1de900, 0 0 10px #118800,
    0 0 5px #118800, 0 0 5px #1de900;

  @media (min-width: 567px) {
    letter-spacing: 2px;
    font-size: 34px;
    margin-right: 40px;
  }

  @media (min-width: 768px) {
    letter-spacing: 2px;
    font-size: 44px;
    margin-right: 40px;
  }

  @media (min-width: 1024px) {
    font-size: 60px;
  }
`;

export const Links = styled.div`
  display: flex;
`;

export const Link = styled.a`
&:not(:last-child) {
  margin-right: 10px;

  @media (min-width: 567px) {
    margin-right: 25px;
  }
})
`;

export const LinkImage = styled.img`
  display: block;
  width: 40px;
  height: 40px;
  padding: 5px;

  @media (min-width: 567px) {
    width: 50px;
    height: 50px;
    padding: 7px;
  }
`;

export const Overview = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 567px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
  }
`;

export const NFTContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;

  @media (min-width: 567px) {
    margin-bottom: 0;
  }
`;

export const NFTImage = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 10px;
  border-radius: 8px;

  @media (min-width: 567px) {
    height: 250px;
    width: 250px;
    margin-bottom: 10px;
  }
`;

export const NFTTitle = styled.h3`
  margin-bottom: 5px;

  @media (min-width: 567px) {
    font-size: 25px;
  }
`;

export const NFTPrice = styled.p``;

export const Stats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;

  @media (min-width: 567px) {
    margin-bottom: 0;
  }
`;

export const ProgressBarContainer = styled.div`
  margin-bottom: 5px;
  width: 100%;

  @media (min-width: 567px) {
    margin-bottom: 0;
  }
`;
export const Redeemed = styled.p`
  font-size: 19px;
  font-weight: 700;

  @media (min-width: 567px) {
    font-size: 25px;
  }
`;
