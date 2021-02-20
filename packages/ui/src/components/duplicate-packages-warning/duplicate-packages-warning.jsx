import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { METRIC_TYPE_FILE_SIZE, METRIC_TYPE_NUMERIC, METRIC_TYPES, getMetricRunInfo } from '@bundle-stats/utils';

import { Alert } from '../../ui';
import { getBundlePackagesByNameComponentLink } from '../../component-links';
import { ComponentLink } from '../component-link';
import css from './duplicate-packages-warning.module.css';
import {Metric} from '../metric';
import {Delta} from '../delta';

const fileSizeMetric = METRIC_TYPES[METRIC_TYPE_FILE_SIZE];
const numberMetric = METRIC_TYPES[METRIC_TYPE_NUMERIC];

export const DuplicatePackagesWarning = (props) => {
  const {
    className,
    duplicatePackages,
    duplicatePackagesCount,
    customComponentLink: CustomComponentLink,
  } = props;

  const entries = Object.entries(duplicatePackages).map(([packageName, packageData]) => {
    // pre v3 structure
    if (Array.isArray(packageData)) {
      return [
        packageName,
        {
          value: null,
          children: packageData.map((packagePath) => ({
            name: packagePath,
            value: null,
          })),
        },
      ];
    }

    return [packageName, packageData];
  });

  const metricRunInfo = getMetricRunInfo(
    numberMetric,
    duplicatePackagesCount.current,
    duplicatePackagesCount.baseline,
  );

  return (
    <Alert kind="warning" className={cx(css.root, className)}>
      <h3 className={css.title}>
        {`Bundle contains`}
        {` `}
        {metricRunInfo.value}
        <sup className={css.titleDelta}>
          (<Delta displayValue={metricRunInfo.displayDelta} deltaType={metricRunInfo.deltaType} />)
        </sup>
        {` `}
        {`duplicate ${metricRunInfo.value === 1 ? 'package' : 'packages'}:`}
      </h3>
      <ol className={css.groups}>
        {entries.map(([packageName, packageData]) => (
          <li key={packageName} className={css.group}>
            <CustomComponentLink
              className={css.groupTitle}
              {...getBundlePackagesByNameComponentLink(packageName)}
            >
              {packageName}
            </CustomComponentLink>
            <ul className={css.groupItems}>
              {packageData.children.map(({ name, value }) => (
                <li key={name} className={css.item}>
                  <CustomComponentLink
                    className={css.itemName}
                    {...getBundlePackagesByNameComponentLink(name)}
                  >
                    {name}
                  </CustomComponentLink>

                  {value && (
                    <Metric
                      className={css.itemValue}
                      value={value}
                      formatter={fileSizeMetric.formatter}
                    />
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Alert>
  );
};

DuplicatePackagesWarning.propTypes = {
  className: PropTypes.string,
  customComponentLink: PropTypes.elementType,
  duplicatePackages: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  duplicatePackagesCount: PropTypes.shape({
    current: PropTypes.number,
    baseline: PropTypes.number,
  }).isRequired,
};

DuplicatePackagesWarning.defaultProps = {
  className: '',
  customComponentLink: ComponentLink,
};
