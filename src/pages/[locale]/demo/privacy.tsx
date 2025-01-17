import { CommonServerSideParams } from '@/app/types/CommonServerSideParams';
import LegalContent from '@/components/dataDisplay/LegalContent';
import { OnlyBrowserPageProps } from '@/layouts/core/types/OnlyBrowserPageProps';
import { SSGPageProps } from '@/layouts/core/types/SSGPageProps';
import DemoLayout from '@/layouts/demo/components/DemoLayout';
import {
  getDemoLayoutStaticPaths,
  getDemoLayoutStaticProps,
} from '@/layouts/demo/demoLayoutSSG';
import { AMPLITUDE_PAGES } from '@/modules/core/amplitude/amplitude';
import useCustomer from '@/modules/core/data/hooks/useCustomer';
import { Customer } from '@/modules/core/data/types/Customer';
import { replaceAllOccurrences } from '@/modules/core/js/string';
import { createLogger } from '@/modules/core/logging/logger';
import {
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import React from 'react';

const fileLabel = 'pages/[locale]/demo/privacy';
const logger = createLogger({ // eslint-disable-line no-unused-vars,@typescript-eslint/no-unused-vars
  fileLabel,
});

/**
 * Only executed on the server side at build time
 * Necessary when a page has dynamic routes and uses "getStaticProps"
 */
export const getStaticPaths: GetStaticPaths<CommonServerSideParams> = getDemoLayoutStaticPaths();

/**
 * Only executed on the server side at build time.
 *
 * @return Props (as "SSGPageProps") that will be passed to the Page component, as props
 *
 * @see https://github.com/vercel/next.js/discussions/10949#discussioncomment-6884
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
 */
export const getStaticProps: GetStaticProps<SSGPageProps, CommonServerSideParams> = getDemoLayoutStaticProps();

/**
 * SSG pages are first rendered by the server (during static bundling)
 * Then, they're rendered by the client, and gain additional props (defined in OnlyBrowserPageProps)
 * Because this last case is the most common (server bundle only happens during development stage), we consider it a default
 * To represent this behaviour, we use the native Partial TS keyword to make all OnlyBrowserPageProps optional
 *
 * Beware props in OnlyBrowserPageProps are not available on the server
 */
type Props = {} & SSGPageProps<Partial<OnlyBrowserPageProps>>;

/**
 * Privacy page, that displays all legal-related information.
 *
 * Basically displays a bunch of markdown that's coming from the CMS.
 */
const PrivacyPage: NextPage<Props> = (props): JSX.Element => {
  const customer: Customer = useCustomer();
  const {
    privacyDescription,
    serviceLabel,
  } = customer || {};

  // Replace dynamic values (like "{customerLabel}") by their actual value
  const privacy = replaceAllOccurrences(privacyDescription, {
    serviceLabel: `**${serviceLabel}**`,
    customerLabel: `**${customer?.label}**`,
  });

  return (
    <DemoLayout
      {...props}
      pageName={AMPLITUDE_PAGES.PRIVACY_PAGE}
    >
      <h2>Field's value (fetched from Airtable API), as <code>Long text</code> (interpreted as Markdown):</h2>
      <LegalContent
        content={privacy}
      />
    </DemoLayout>
  );
};

export default (PrivacyPage);
