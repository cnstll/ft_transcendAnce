interface TooltipProps {
  description: string,
  element: JSX.Element
}
function Tooltip(props: TooltipProps) {
  return (
    <>
      <a title={props.description}> {props.element}</a>
    </>
  );
}

export default Tooltip;
