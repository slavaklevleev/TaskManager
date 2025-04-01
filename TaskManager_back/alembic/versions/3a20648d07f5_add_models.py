"""Add models

Revision ID: 3a20648d07f5
Revises: 4498743e6d3d
Create Date: 2025-03-13 16:37:19.362901

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3a20648d07f5'
down_revision: Union[str, None] = '4498743e6d3d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('habits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('frequency', sa.JSON(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_habits_id'), 'habits', ['id'], unique=False)
    op.create_table('notes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('color', sa.String(), nullable=True),
    sa.Column('pinned', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notes_id'), 'notes', ['id'], unique=False)
    op.create_table('projects',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('color', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)
    op.create_table('tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('color', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tags_id'), 'tags', ['id'], unique=False)
    op.create_table('task_tag',
    sa.Column('task_id', sa.Integer(), nullable=True),
    sa.Column('tag_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ),
    sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], )
    )
    op.add_column('tasks', sa.Column('project_id', sa.Integer(), nullable=True))
    op.add_column('tasks', sa.Column('due_date', sa.Date(), nullable=True))
    op.create_foreign_key(None, 'tasks', 'projects', ['project_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'tasks', type_='foreignkey')
    op.drop_column('tasks', 'due_date')
    op.drop_column('tasks', 'project_id')
    op.drop_table('task_tag')
    op.drop_index(op.f('ix_tags_id'), table_name='tags')
    op.drop_table('tags')
    op.drop_index(op.f('ix_projects_id'), table_name='projects')
    op.drop_table('projects')
    op.drop_index(op.f('ix_notes_id'), table_name='notes')
    op.drop_table('notes')
    op.drop_index(op.f('ix_habits_id'), table_name='habits')
    op.drop_table('habits')
    # ### end Alembic commands ###
