import PropTypes from 'prop-types';
import { useState } from 'react';

import styles from './AmountInput.module.css';

const AmountInput = (props) => {
  // const [amount, setAmount] = useState(0);
  // const inputChangeHandler = (e) => {
  //   setAmount(e.target.value);
  // };
  //Form submission happens here
  return (
    <div className={styles.rateInput}>
      <form>
        <div>
          <label htmlFor='rate'>Enter the amount you want to convert</label>
        </div>
        <div>
          <input
            name='Amount'
            value={props.amount}
            onChange={(e) => props.inputChangeHandler(e.target.value)}
            type='text'
          />
        </div>
      </form>
    </div>
  );
};

AmountInput.propsTypes = {
  style: PropTypes.object,
  value: PropTypes.number,
};

export default AmountInput;
