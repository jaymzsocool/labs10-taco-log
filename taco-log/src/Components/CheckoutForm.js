import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import StripeCheckout from 'react-stripe-checkout'; 

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state= {
        complete: false
    }
    this.submit = this.submit.bind(this);
  }

  createOrder = token => {console.log(token)}

  async submit(ev) {
    let {token} = await this.props.stripe.createToken({name: "Name"});
    let response = await fetch("/charge", {
    method: "POST",
    headers: {"Content-Type": "text/plain"},
    body: token.id
  });

  if (response.ok) this.setState({complete: true});
  }

  render() {
    if (this.state.complete) return <h1>Purchase Complete</h1>;

    return (
      <div className="checkout">
        <p>Would you like to leave a tip?</p>
        {/* <CardElement /> */}
        <StripeCheckout
                  amount="9.99"
                  name="Taco logs"
                  description="Taco Logs"
                  stripeKey="pk_test_wWgYjRm8woZFFe75so0wo6jp"
                  email="myemail@email.com"
                  currency="USD"
                  token={res => this.onToken(this.createOrder)}
                >
                  <button>Leave a tip!</button>
        </StripeCheckout> 
        
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);