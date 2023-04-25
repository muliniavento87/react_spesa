import { useRef } from 'react';
import { CToast, CToastHeader, CToastBody, CToaster, CToastClose } from '@coreui/bootstrap-react';

export default function Notifica({ show = false, title = "titolo", msg = "notifica", disable }) {
    const toaster = useRef()
    // <small>7 min ago</small>
    const autoHideSeconds = 2000;
    /*
    <svg
        className="rounded me-2"
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        role="img"
    >
    */
    const bodyToast = (
        <CToast title="Bootstrap React" autohide={true} delay={autoHideSeconds} show={true} visible={true} >
            <CToastHeader close>
                <svg className="rounded me-2" width="20" height="20">
                    <rect width="100%" height="100%" fill="#777777"></rect>
                </svg>
                <strong className="me-auto">{title}</strong>
                <CToastClose className="me-2 m-auto" />
            </CToastHeader>
            <CToastBody>{msg}</CToastBody>
        </CToast>
    )
    return (
        // <CToaster ref={toaster} push={toast} placement="top-end" />
        // <CToaster ref={toaster} push={toast} placement="bottom-start" />
        <>
            <CToaster ref={toaster} push={(show) ? bodyToast : 0} placement="bottom-start" />
            {show && disable()}
        </>
    )
}