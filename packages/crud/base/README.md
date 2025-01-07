# BaseFormWizardView Documentation

## Overview
`BaseFormWizardView` is a base class designed for creating multi-step form wizards in Zango applications. This view can be extended to create the form wizard.


## Usage


### Step 1: Define Your Forms

```python
from ..packages.crud.forms import BaseForm
from ..packages.crud.form_fields import ModelField

from .models import Patient # Import model of your choice

class PatientForm(BaseForm):

    name = ModelField(
        placeholder="Enter Name",
        required=True,
        required_msg="This field is required."
    )

    address = ModelField(
        placeholder="Enter Address", 
        required=False
    )

    country = ModelField(
        placeholder="Select Country",
        required=True,
        required_msg="This field is required.",
    )

    class Meta:
        model = Patient
        title = "Patient Registration"

class CaregiverForm(BaseForm):

    name = ModelField(
        placeholder="Enter Name",
        required=True,
        required_msg="This field is required."
    )

    relation = ModelField(
        placeholder="Caregiver Relation",
        required=True,
        required_msg="This field is required."
    )

    contact_number = ModelField(
        placeholder="Enter Contact Number",
        required=True,
        required_msg="This field is required."
    )

    class Meta:
        model = Caregiver
        title = "Caregiver Registration"

```

### Step 2: Create Your Wizard View

```python

from ..packages.crud.base import BaseFormWizardView

class PatientFormWizardView(BaseFormWizardView):
    page_title = "Patient Form Wizard" 
    wizard_title = "Patient Registration"

    form_list = (
        ("step_patient", PatientForm),
        ("step_caregiver", CaregiverForm),
    )
    
    success_url = "/customers/customer/"

```


## Key Methods

### 1. `process_step`
This method is used to postprocess the form data. This method is called after the particular form is submitted. After processing is done form data needs to be returned

#### Signature:
```python
def process_step(self, form):
    # Process the form data
    return self.get_form_step_data(form)
```

#### Parameters:

- ``form (Form)``: The form mapped to the step.

### 2. `process_step_done`
This method is called in the ``done`` method of the wizard view. You can override this method to perform custom actions after a step is processed.

#### Signature:
```python
def process_step_done(self, step, form, object_instance, form_list, **kwargs):
    pass
```

#### Parameters:

- ``step (str)``: The step key.
- ``form (Form)``: The form mapped to the step.
- ``object_instance (object)``: The object instance.
- ``form_list (list)``: form_list defined in the Wizard View.
- ``**kwargs``: Additional keyword arguments.

### 3. `condition_dict`
This method allows you to specify conditions for showing certain steps based on custom logic.

### Define condition_dict

``condition_dict`` is a dictionary of boolean values or callables. If the value of for a specific `step_key` is callable it will be called with the wizardview instance as the only argument. If the return value is true, the step's form will be used.


```python
class PatientFormWizardView(BaseFormWizardView)
    ...
    condition_dict = {
        "step_patient": show_step_patient
    }
```

#### Signature:
```python
def show_step_caregiver(self, wizard):
   """
    Check if the given step should be shown or not

    Args:
        wizard: The Wizard view instance

    Returns:
        bool: True if the first step should be shown, False otherwise.
    """
    # Custom logic for condition check
    # return True/False
```

Example:
```python
def show_step_caregiver(wizard):
    # Get cleaned data from patient step
    cleaned_data = wizard.get_cleaned_data_for_step('step_patient')
    # Return true if the user selected credit card
    return cleaned_data['country'] == 'IND'
```


## Customization

#### display_sidebar

By default in wizard view the sidebar is hidden. You can customize this by setting the `display_sidebar` parameter to `True` in ``get_context_data`` method.

Example:

```python
class PatientFormWizardView(BaseFormWizardView):
    
    def get_context_data(self, **kwargs):
        kwargs["display_sidebar"] = True
        context = super().get_context_data(**kwargs)
        return context
```


