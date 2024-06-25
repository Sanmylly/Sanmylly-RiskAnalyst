// Query database to check if there are recent fraudulent transactions from this user

const dataBase = require('./transactional-sample.csv');

const transactionLogVerification = (user_id) => {
    const userHistory = dataBase.find((data) => data.user_id === user_id);
    const userCbkHist = userHistory.find((t) => t.has_cbk === true);
    if(userCbkHist === undefined) {
        return false;
    }
   return true;
};

// Function to perform anti-fraud checks
const antiFraud = async (transaction) => {
    const { transaction_id, user_id, transaction_date, transaction_amount } = transaction;
    const fraudulentHistory = await transactionLogVerification(user_id);
    const transactionTime = new Date(transaction_date).getHours();

    if (transaction_amount > 1000) {
       return { 
            "transaction_id": transaction_id,
            "recommendation": "deny"
        }
    } if (fraudulentHistory) {
        return { 
            "transaction_id": transaction_id,
            "recommendation": "deny"
        }
    } 
    if (transaction_amount > 500 && (transactionTime < 9 || transactionTime >= 18)) {
        return { 
            "transaction_id": transaction_id,
            "recommendation": "deny"
        };
    }

    return { 
        "transaction_id": transaction_id,
        "recommendation": "approve"
    };
}