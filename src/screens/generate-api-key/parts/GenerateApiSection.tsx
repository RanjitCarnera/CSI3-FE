import React, { Suspense, useState } from "react";
import { Button, Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ValidatedField } from "@components/ui/ValidatedField";
import { useSelector } from "react-redux";
import { selectLoginData } from "@redux/AuthSlice";
import { SelectGroupField } from "@components/relay/SelectGroupField";
import { DefaultTextFieldComponent, ApiSecretFieldComponent } from "@components/ui/DefaultTextInput";
import { ButtonsWrapper } from "@screens/recovery-codes/recovery-codes.styles";
import { toast } from "react-toastify";
import { TkDialog } from "@components/ui/TkDialog";
import { FooterWrapperContainer } from "./api-key-secret-modal.styles";
import { TkButton } from "@components/ui/TkButton";

interface ApiKeySecretState {
    apiKey: string,
    apiSecret: string
}
interface FormState {
	name?: string;
	groupId?: string;
    apiKey?: string;
    apiSecret?: string;
}

export const GenerateApiSection =({ triggerRefetch }: { triggerRefetch:(value: boolean) => void }) => {

    const loginData = useSelector(selectLoginData);
    const [apiKeySecret, setApiKeySecret] = useState<ApiKeySecretState>();
	const [isVisible, setVisible] = useState<boolean>(false);
  
    const handleCopyOnClick = () => {
        if (apiKeySecret?.apiSecret) {
            void navigator.clipboard.writeText(`Api key is <b>  ${apiKeySecret.apiKey} </b> and api secret is ${apiKeySecret.apiSecret}`);
            toast.success("Api key and secret copied.");
            setApiKeySecret(undefined);
            formik.resetForm();
        }
    };

    const formik = useFormik<FormState>({
            initialValues: {
                name:'',
                groupId:''
            },
            enableReinitialize: true,
            validationSchema: Yup.object().shape({
                name: Yup.string().required("Name is required"),
                groupId: Yup.string().required("Group is required"),
            }),
            onSubmit: (values, { setSubmitting, resetForm }) => {
                 fetch(`${process.env.REACT_APP_API_BASE}/api/generate-public-token`, {
                    method: "POST",
                    headers: new Headers({ 
                        "content-type": "application/json", 
                        "Authorization": loginData?.accessToken ? `${loginData.accessToken}` : "" 
                    }),
                    body: JSON.stringify({
                        name: values.name,
                        groupId: values.groupId
                    }),
                })
                    .then((res) => res.json())
                    .then(data => {
                        setApiKeySecret(data);
                        formik.setFieldValue("apiKey", data?.apiKey);
                        formik.setFieldValue("apiSecret", data?.apiSecret);
                        setVisible(true);
                        triggerRefetch(true);
                    })
                    .catch((err) => console.error(err));           
                
                },
        });

    return (
            <>
            
           <Form onSubmit={formik.handleSubmit}>
            <ValidatedField<FormState, string>
                className="mb-4"
                name={"name"}
                label={"Name"}
                required={true}
                formikConfig={formik}
                component={DefaultTextFieldComponent}
            />
            <Suspense fallback={"Loading..."}>
                <ValidatedField<FormState, string>
                    className="mb-4"
                    name={"groupId"}
                    label={"Select group to add"}
                    placeholder={"Default: User"}
                    required={true}
                    formikConfig={formik}
                    component={SelectGroupField}
                />
            </Suspense>
            
            <ButtonsWrapper>
                <TkButton style={{width:'fit-content'}} label={"Create API secret"} onClick={(e) => { 
                    e.preventDefault(); 
                    formik.handleSubmit(); 
                }} />
                </ButtonsWrapper>
          </Form>
            <TkDialog
                header={<h1>{"Api Key & Secret"}</h1>}
                dismissableMask={true}
                visible={isVisible}
                onHide={() => {
                    setVisible(false);
                    handleCopyOnClick();
                }}
                footer={
                    <FooterWrapperContainer>
                        <Button 
                            content={{ label: "Copy key and secret" }} 
                            onClick={() =>{
                                setVisible(false);
                                handleCopyOnClick();
                            }} 
                            inputVariant={"solid"}/>
                    </FooterWrapperContainer>
                }>
                <div>
                    <ValidatedField<FormState, string>
                        name="apiKey"
                        label="API Key"
                        formikConfig={formik}
                        component={ApiSecretFieldComponent}
                    />

                    <ValidatedField<FormState, string>
                        name="apiSecret"
                        label="API Secret"
                        formikConfig={formik}
                        component={ApiSecretFieldComponent}
                    />
                </div>
            </TkDialog>

        </>

    )
}