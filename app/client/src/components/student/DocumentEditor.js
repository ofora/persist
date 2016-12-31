import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {MenuItem} from 'material-ui';
import {FileInput} from '../utils';
import {SelectField, TextField} from 'redux-form-material-ui';
import {types} from '../../../../common/validator';

class DocumentEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, initialValues} = this.props;
        const documentTypes = types['documents.types'].map((option) => (
            <MenuItem value={ option } key={ option } primaryText={ option }/>
        ));
        return (
            <form onSubmit={handleSubmit}>
                <Field
                    name='name'
                    component={TextField}
                    hintText='Name'
                    floatingLabelText='Name'
                />
                <Field
                    name='type'
                    component={SelectField}
                    hintText='Type'
                    floatingLabelText='Type'
                >
                    {documentTypes}
                </Field>
                <Field
                    type='file'
                    Key={initialValues.Key}
                    fileLink={initialValues.downloadLink}
                    name='document'
                    component={FileInput}
                />
            </form>
        );
    }
}

DocumentEditor = reduxForm({
    form: 'DocumentEditor'
})(DocumentEditor);

export default DocumentEditor;