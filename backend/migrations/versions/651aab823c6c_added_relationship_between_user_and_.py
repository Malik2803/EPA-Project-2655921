"""Added relationship between user and tasks

Revision ID: 651aab823c6c
Revises: 14b3aef7dca0
Create Date: 2024-12-10 16:11:28.986107

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '651aab823c6c'
down_revision = '14b3aef7dca0'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('task', schema=None) as batch_op:
        # Drop constraints associated with the 'assignee' column if any
        # batch_op.drop_constraint('constraint_name', type_='foreignkey')  # Example for dropping a foreign key constraint
        batch_op.drop_column('assignee')
        batch_op.add_column(sa.Column('assignee_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_task_assignee', 'user', ['assignee_id'], ['id'])


def downgrade():
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.add_column(sa.Column('assignee', sa.String(length=100), nullable=False))
        batch_op.drop_constraint('fk_task_assignee', type_='foreignkey')
        batch_op.drop_column('assignee_id')
