/**
 * Created by hzzhangzhang1 on 2017/5/7.
 */
import React from 'react';
import img from '@/assets/img/404.png';

class NotFound extends React.Component {
    render() {
        return (
            <div className="center" style={{ height: '100%', background: '#ececec', overflow: 'hidden' }}>
                <img src={img} alt="404" />
            </div>
        );
    }
}

export default NotFound;
