"""Template service for business logic."""

from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models import Template, Channel
from config.exceptions_handler import DatabaseError, ValidationError
from utils.logger_utils import get_module_logger

logger = get_module_logger("services.template_service")


class TemplateService:
    """Service for template business logic."""
    
    @staticmethod
    def create_template(
        db: Session,
        channel_id: UUID,
        extraction_config: dict,
        created_by: UUID,
        test_message: Optional[str] = None,
        is_active: bool = True
    ) -> Template:
        """
        Create a new template.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            extraction_config: Extraction configuration dictionary
            created_by: Account UUID of creator
            test_message: Optional test message
            is_active: Whether template is active
            
        Returns:
            Created Template object
            
        Raises:
            ValidationError: If channel not found or validation fails
            DatabaseError: If creation fails
        """
        # Verify channel exists
        channel = db.query(Channel).filter(Channel.id == channel_id).first()
        if not channel:
            raise ValidationError("Channel not found")
        
        try:
            template = Template(
                channel_id=channel_id,
                extraction_config=extraction_config,
                test_message=test_message,
                is_active=is_active,
                created_by=created_by,
                version=1
            )
            
            db.add(template)
            db.commit()
            db.refresh(template)
            
            logger.info(f"Template created successfully: {template.id} (channel: {channel_id})")
            return template
            
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Integrity error creating template: {e}", exc_info=True)
            raise DatabaseError("Failed to create template due to database constraint") from e
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create template: {e}", exc_info=True)
            raise DatabaseError(f"Failed to create template: {e}") from e
    
    @staticmethod
    def get_template_by_id(db: Session, template_id: UUID) -> Optional[Template]:
        """
        Get a template by ID.
        
        Args:
            db: Database session
            template_id: Template UUID
            
        Returns:
            Template object or None if not found
        """
        return db.query(Template).filter(Template.id == template_id).first()
    
    @staticmethod
    def get_channel_templates(
        db: Session,
        channel_id: UUID,
        active_only: bool = False
    ) -> List[Template]:
        """
        Get all templates for a channel.
        
        Args:
            db: Database session
            channel_id: Channel UUID
            active_only: If True, only return active templates
            
        Returns:
            List of Template objects
        """
        query = db.query(Template).filter(Template.channel_id == channel_id)
        
        if active_only:
            query = query.filter(Template.is_active == True)
        
        return query.order_by(Template.created_at.desc()).all()
    
    @staticmethod
    def update_template(
        db: Session,
        template_id: UUID,
        update_data: dict
    ) -> Template:
        """
        Update an existing template.
        
        Args:
            db: Database session
            template_id: Template UUID
            update_data: Dictionary with fields to update
            
        Returns:
            Updated Template object
            
        Raises:
            ValidationError: If template not found
            DatabaseError: If update fails
        """
        template = TemplateService.get_template_by_id(db, template_id)
        if not template:
            raise ValidationError("Template not found")
        
        try:
            # If extraction_config is updated, increment version
            if 'extraction_config' in update_data:
                template.version += 1
            
            # Update fields
            for key, value in update_data.items():
                setattr(template, key, value)
            
            db.commit()
            db.refresh(template)
            
            logger.info(f"Template updated successfully: {template_id}")
            return template
            
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update template {template_id}: {e}", exc_info=True)
            raise DatabaseError(f"Failed to update template: {e}") from e
    
    @staticmethod
    def delete_template(db: Session, template_id: UUID) -> None:
        """
        Delete a template.
        
        Args:
            db: Database session
            template_id: Template UUID
            
        Raises:
            ValidationError: If template not found
            DatabaseError: If deletion fails
        """
        template = TemplateService.get_template_by_id(db, template_id)
        if not template:
            raise ValidationError("Template not found")
        
        try:
            db.delete(template)
            db.commit()
            
            logger.info(f"Template deleted successfully: {template_id}")
            
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to delete template {template_id}: {e}", exc_info=True)
            raise DatabaseError(f"Failed to delete template: {e}") from e
    
    @staticmethod
    def toggle_template_active(db: Session, template_id: UUID) -> Template:
        """
        Toggle template active status.
        
        Args:
            db: Database session
            template_id: Template UUID
            
        Returns:
            Updated Template object
            
        Raises:
            ValidationError: If template not found
        """
        template = TemplateService.get_template_by_id(db, template_id)
        if not template:
            raise ValidationError("Template not found")
        
        template.is_active = not template.is_active
        db.commit()
        db.refresh(template)
        
        logger.info(f"Template {template_id} active status toggled to {template.is_active}")
        return template

