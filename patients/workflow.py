
from ..packages.workflow.base.engine import WorkflowBase













class PatientWorkflow(WorkflowBase):

    status_transitions = [
        
        {
            "name": "assessment_pending",
            "display_name": "assessment_pending",
            "description": "assessment_pending",
            "from": "registered",
            "to": "assessment_pending",
            
            "confirmation_message": "None"
        },
        
        {
            "name": "in_treatment",
            "display_name": "in_treatment",
            "description": "in_treatment",
            "from": "assessment_pending",
            "to": "in_treatment",
            
            "confirmation_message": "None"
        },
        
        {
            "name": "progress_review",
            "display_name": "progress_review",
            "description": "progress_review",
            "from": "in_treatment",
            "to": "progress_review",
            
            "confirmation_message": "None"
        },
        
        {
            "name": "in_treatment",
            "display_name": "in_treatment",
            "description": "in_treatment",
            "from": "progress_review",
            "to": "in_treatment",
            
            "confirmation_message": "None"
        },
        
        {
            "name": "discharged",
            "display_name": "discharged",
            "description": "discharged",
            "from": "in_treatment",
            "to": "discharged",
            
            "confirmation_message": "None"
        },
        
    ]

    tag_transitions = [
        
        {
            "name": "speech_therapy",
            "enabled": {
                "confirmation_message": "are you sure you want to tag this patient as speech therapy?",
            },
            "disabled": {
                "confirmation_message": "are you sure you want to untag this patient as speech therapy?",
            },
        },
        
        {
            "name": "pediatric_care",
            "enabled": {
                "confirmation_message": "are you sure you want to tag this patient as pediatric care?",
            },
            "disabled": {
                "confirmation_message": "are you sure you want to untag this patient as pediatric care?",
            },
        },
        
        {
            "name": "language_delay",
            "enabled": {
                "confirmation_message": "are you sure you want to tag this patient as language delay?",
            },
            "disabled": {
                "confirmation_message": "are you sure you want to untag this patient as language delay?",
            },
        },
        
        {
            "name": "articulation_disorder",
            "enabled": {
                "confirmation_message": "are you sure you want to tag this patient as articulation disorder?",
            },
            "disabled": {
                "confirmation_message": "are you sure you want to untag this patient as articulation disorder?",
            },
        },
        
        {
            "name": "fluency_disorder",
            "enabled": {
                "confirmation_message": "are you sure you want to tag this patient as fluency disorder?",
            },
            "disabled": {
                "confirmation_message": "are you sure you want to untag this patient as fluency disorder?",
            },
        },
        
    ]

    class Meta:
        on_create_status = "registered"
        statuses = {
            
            "registered": {
                "color": "blue",
                "label": "registered"
            },
            
            "assessment_pending": {
                "color": "orange",
                "label": "assessment_pending"
            },
            
            "in_treatment": {
                "color": "green",
                "label": "in_treatment"
            },
            
            "progress_review": {
                "color": "purple",
                "label": "progress_review"
            },
            
            "discharged": {
                "color": "grey",
                "label": "discharged"
            },
            
        }

        tags = [
            
            ("speech_therapy", "speech therapy"),
            
            ("pediatric_care", "pediatric care"),
            
            ("language_delay", "language delay"),
            
            ("articulation_disorder", "articulation disorder"),
            
            ("fluency_disorder", "fluency disorder"),
            
        ]



