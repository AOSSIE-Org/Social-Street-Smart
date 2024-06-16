#for migrations
from flask_script import Manager, Server
from flask_migrate import Migrate, MigrateCommand

from application import application, db

migrate = Migrate(application, db)
manager = Manager(application)

manager.add_command('db', MigrateCommand)
# manager.add_command("runserver", Server(host="127.0.0.1", port=8091))
#for AWS instance
manager.add_command("runserver", Server(host="0.0.0.0", port=8091))

if __name__ == '__main__':
    print("starting main manage")
    manager.run()