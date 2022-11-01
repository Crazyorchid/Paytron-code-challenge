import { useState, useEffect } from 'react';
import DropDown from '../../Components/DropDown';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';
import AmountInput from '../../Components/AmountInput';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';
import { calculateRate } from '../../Hooks/calculateRate';
import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';

let countries = CountryData.CountryCodes;

const Rates = () => {
  const [fromCurrency, setFromCurrency] = useState('AU');
  const [toCurrency, setToCurrency] = useState('US');
  const [exchangeRate, setExchangeRate] = useState(0.7456);
  const [progression, setProgression] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const Flag = ({ code }) => (
    <img
      alt={code || ''}
      src={`/img/flags/${code || ''}.svg`}
      width='20px'
      className={classes.flag}
    />
  );

  const fetchData = async () => {
    const sellCurrency = countryToCurrency[fromCurrency];
    const buyCurrency = countryToCurrency[toCurrency];
    if (!loading) {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_ENDPOINT}?sellCurrency=${sellCurrency}&buyCurrency=${buyCurrency}`;
      try {
        const response = await fetch(url);
        const responseJson = await response.json();
        if (responseJson.retailRate) {
          setExchangeRate(responseJson.retailRate);
        } else {
          setExchangeRate(NaN);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  const inputChangeHandler = (e) => {
    setAmount(e);
  };

  // Demo progress bar moving :)
  useAnimationFrame(!loading, (deltaTime) => {
    setProgression((prevState) => {
      if (prevState > 0.998) {
        fetchData();
        return 0;
      }
      return (prevState + deltaTime * 0.0001) % 1;
    });
  });

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>

        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={'From'}
              selected={countryToCurrency[fromCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setFromCurrency(key);
              }}
              style={{ marginRight: '20px' }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={'25px'} />
            </div>

            <div className={classes.rate}>
              {exchangeRate !== undefined ? exchangeRate : 0}
            </div>
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={'To'}
              selected={countryToCurrency[toCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setToCurrency(key);
              }}
              style={{ marginLeft: '20px' }}
            />
          </div>
        </div>
        <div>
          <AmountInput inputChangeHandler={inputChangeHandler} value={amount} />
          Converted Result: {calculateRate(amount, exchangeRate)}
        </div>

        <ProgressBar
          progress={progression}
          animationClass={loading ? classes.slow : ''}
          style={{ marginTop: '20px' }}
        />

        {loading && (
          <div className={classes.loaderWrapper}>
            <Loader width={'25px'} height={'25px'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Rates;
