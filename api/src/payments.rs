use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use stripe::{
    AttachPaymentMethod, CardDetailsParams, CreateCustomer, CreatePaymentMethod,
    CreatePaymentMethodCardUnion, CreateSubscription, CreateSubscriptionItems, Customer,
    CustomerId, PaymentMethod, PaymentMethodTypeFilter, Subscription,
};

use crate::AppState;

#[derive(Deserialize, Serialize)]
pub struct PaymentInfo {
    name: String,
    email: String,
    card_number: String,
    exp_year: i32,
    exp_month: i32,
    cvc: String,
}

pub async fn create_checkout(State(state): State<AppState>, Json(req): Json<PaymentInfo>) -> Result<StatusCode, StatusCode> {
    let ctx = stripe::Client::new(&state.stripe_key);

    let customer = Customer::create(
        &ctx,
        CreateCustomer {
            name: Some(&req.name),
            email: Some(&req.email),
            ..Default::default()
        },
    )
    .await
    .unwrap();

    let payment_method = {
        let pm = PaymentMethod::create(
            &ctx,
            CreatePaymentMethod {
                type_: Some(PaymentMethodTypeFilter::Card),
                card: Some(CreatePaymentMethodCardUnion::CardDetailsParams(
                    CardDetailsParams {
                        number: req.email,
                        exp_year: req.exp_year,
                        exp_month: req.exp_month,
                        cvc: Some(req.cvc),
                    },
                )),
                ..Default::default()
            },
        )
        .await
        .unwrap();

        PaymentMethod::attach(
            &ctx,
            &pm.id,
            AttachPaymentMethod {
                customer: customer.id.clone(),
            },
        )
        .await
        .unwrap();

        pm
    };

    let mut params = create_checkout_params(customer.id);

    params.default_payment_method = Some(&payment_method.id);

    let Ok(_) = Subscription::create(&ctx, params).await else {
        return Err(StatusCode::INTERNAL_SERVER_ERROR)
    };

    Ok(StatusCode::OK)
}

fn create_checkout_params(customer_id: CustomerId) -> CreateSubscription<'static> {
    let mut params = CreateSubscription::new(customer_id);
    params.items = Some(vec![CreateSubscriptionItems {
        price: Some("price_1Mxby1I1KxxteAOMLAMeWgQD".to_string()),
        ..Default::default()
    }]);
    params.expand = &["items", "items.data.price.product", "schedule"];

    params
}