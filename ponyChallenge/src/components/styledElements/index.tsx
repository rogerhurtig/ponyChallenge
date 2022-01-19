import styled from 'styled-components';

type LabelProps = {
  color?: string;
}
export const Label = styled.label<LabelProps>`
{
  color: ${({ color }) => color || '#ffffff'};
}
`;

type TextDivProps = {
  color?: string;
}
export const TextDiv = styled.div<TextDivProps>`
{
  color: ${({ color }) => color || '#ffffff'};
}
`;

type MapContainerProps = {
  backgroundColor?: string;
}
export const MapContainer = styled.div<MapContainerProps>`
{
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor || '#000000'};
}
`;