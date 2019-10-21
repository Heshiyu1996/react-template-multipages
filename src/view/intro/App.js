import React from 'react';
import { Layout, ConfigProvider, BackTop } from 'antd';
import { IntlProvider } from 'react-intl';
import { hot } from 'react-hot-loader';
import Routes from '@/router/tools';
import HeaderCustom from '@/components/header';
import FooterCustom from '@/components/footer';
import useLanguage from '@/hooks/common/useLanguage';

// 全局组件“中文”配置
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const { Content } = Layout;

function App(props) {
    const [locale, messages] = useLanguage('zh');

    return (
        <Layout>
            <IntlProvider locale={locale} messages={messages.locale}>
                <HeaderCustom />
                <Content>
                    <ConfigProvider locale={messages.antd}>
                        <Routes origin />
                    </ConfigProvider>
                </Content>
                <FooterCustom />
                <BackTop />
            </IntlProvider>
        </Layout>
    );
}

export default hot(module)(App);
