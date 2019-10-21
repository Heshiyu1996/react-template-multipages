import React from 'react';
import { Link } from 'react-router-dom';
import Routes, { getSubList } from '@/router/tools';
import { Button } from 'antd';
import './index.less';

function IntroIndex(props) {
    const LinkMap = getSubList(props);

    return (
        <div className="m-intro-index">
            介绍种类菜单
            <ul className="link-wrapper">
                {LinkMap.map(item => {
                    return (
                        <Link key={item.link} to={item.link}>
                            <Button>{item.title}</Button>
                        </Link>
                    );
                })}
            </ul>
            <Routes {...props} />
        </div>
    );
}

export default IntroIndex;
