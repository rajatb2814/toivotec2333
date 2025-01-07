import * as React from 'react';
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import { ReactComponent as CloseBtn } from '../../assests/images/CloseBtn.svg';

export default function DismissableToast() {
  return (
    <div>
      <Toaster
        reverseOrder={false}
        position="bottom-left"
        toastOptions={{
          style: {
            borderRadius: '4px',
            background: '#333',
            color: '#495057',
          },
          success: {
            duration: 5000,
            style: { background: '#E4F9F2', border: '#2CBE90' },
          },
          error: {
            duration: 5000,
            style: { background: 'rgb(252, 165, 165)' },
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {/* {t.type !== 'loading' && (
                  // <div className="flex h-full flex-col justify-start">
                  <button
                    className="ring-primary-400   rounded-full p-1 transition hover:bg-red-200 focus:outline-none focus-visible:ring"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <CloseBtn></CloseBtn>
                  </button>
                  // </div>
                )} */}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  );
}
