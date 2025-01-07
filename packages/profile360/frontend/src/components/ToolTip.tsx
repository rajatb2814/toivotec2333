import { FC, ReactNode, useRef } from 'react';

interface Props {
  children: ReactNode;
  tooltip?: string;
}

const ToolTip: FC<Props> = ({ children, tooltip }): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      onMouseEnter={({ clientX, clientY }) => {
        if (!tooltipRef.current || !container.current) return;

        tooltipRef.current.style.left = clientX + 4 + 'px';
        tooltipRef.current.style.top = clientY + 4 + 'px';
      }}
      className="group inline-block w-full"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="invisible fixed z-[1000] mt-2 max-w-xs rounded bg-neutral-700 px-3 py-2 font-lato text-xs font-bold text-white opacity-90 transition group-hover:visible group-hover:opacity-[0.92]"
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
};

export default ToolTip;
