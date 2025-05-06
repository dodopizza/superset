# Документация по шаблонам (Templates) в DODO

## Содержание

1. [Введение](#введение)
2. [Архитектура](#архитектура)
3. [Основные компоненты](#основные-компоненты)
   - [Шаблоны Superset](#шаблоны-superset)
   - [Шаблоны электронной почты](#шаблоны-электронной-почты)
   - [Шаблоны Slack](#шаблоны-slack)
   - [Шаблоны AppBuilder](#шаблоны-appbuilder)
4. [DODO-специфичные модификации](#dodo-специфичные-модификации)
5. [Техническая реализация](#техническая-реализация)
6. [Примеры использования](#примеры-использования)

## Введение

Модуль `templates` в Superset содержит шаблоны Jinja2, которые используются для генерации HTML-страниц, электронных писем и сообщений в Slack. Шаблоны позволяют отделить логику приложения от представления данных, что делает код более модульным и легким для поддержки.

В DODO этот модуль используется для отображения пользовательского интерфейса, отправки уведомлений и генерации отчетов. Некоторые шаблоны были модифицированы для поддержки русского языка и специфичных для DODO функций.

## Архитектура

Модуль `templates` организован следующим образом:

1. **Основные директории**:
   - `superset` - шаблоны для основных страниц Superset
   - `email` - шаблоны для электронных писем
   - `slack` - шаблоны для сообщений в Slack
   - `appbuilder` - шаблоны для Flask-AppBuilder

2. **Основные файлы**:
   - `tail_js_custom_extra.html` - дополнительный JavaScript, который добавляется в конец страницы

3. **Связанные модули**:
   - `superset/utils/core.py` - утилиты для работы с шаблонами
   - `superset/views/base.py` - базовые представления, использующие шаблоны
   - `superset/reports/notifications.py` - уведомления, использующие шаблоны

## Основные компоненты

### Шаблоны Superset

Директория `superset` содержит шаблоны для основных страниц Superset:

1. **models/database** - шаблоны для страниц управления базами данных:
   - `add.html` - шаблон для страницы добавления базы данных
   - `edit.html` - шаблон для страницы редактирования базы данных
   - `macros.html` - макросы для страниц баз данных

2. **export_dashboards.html** - шаблон для экспорта дашбордов:
   ```html
   {% import "superset/macros.html" as macros %}
   <script nonce="{{ macros.get_nonce() }}">
       window.onload = function() {
           // See issue #7353, window.open fails
           var a = document.createElement('a');
           a.href = window.location + '&action=go';
           a.download = 'dashboards.json';
           document.body.appendChild(a);
           a.click();
           document.body.removeChild(a);

           window.location = '{{ dashboards_url }}';
       };
   </script>
   ```

3. **paper-theme.html** - шаблон для темы Paper:
   ```html
   <div class="page-header">
     <h1>Wells</h1>
   </div>
   <div class="well">
     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Aenean lacinia bibendum nulla sed consectetur.</p>
   </div>
   <ul class="nav nav-tabs">
     <li role="presentation" class="active"><a href="#">Home</a></li>
     <li role="presentation"><a href="#">Profile</a></li>
     <li role="presentation"><a href="#">Messages</a></li>
   </ul>
   This is tabs above here
   ```

### Шаблоны электронной почты

Директория `email` содержит шаблоны для электронных писем, которые отправляются из Superset:

1. **alert.txt** - шаблон для уведомлений о срабатывании алертов:
   ```
   *Triggered Alert: {{label}} :redalert:*
   *Query*:```{{sql}}```
   *Result*: {{observation_value}}
   *Reason*: {{validation_error_message}}
   <{{alert_url}}|View Alert Details>
   ```

2. **report.txt** - шаблон для отчетов:
   ```
   Report Schedule: {{label}}
   <{{report_url}}|View Report Details>
   ```

### Шаблоны Slack

Директория `slack` содержит шаблоны для сообщений в Slack:

1. **alert_no_screenshot.txt** - шаблон для уведомлений о срабатывании алертов без скриншота:
   ```
   *Triggered Alert: {{label}} :redalert:*
   *Query*:```{{sql}}```
   *Result*: {{observation_value}}
   *Reason*: {{validation_error_message}}
   <{{alert_url}}|View Alert Details>
   ```

2. **alert.txt** - шаблон для уведомлений о срабатывании алертов со скриншотом:
   ```
   *Triggered Alert: {{label}} :redalert:*
   *Query*:```{{sql}}```
   *Result*: {{observation_value}}
   *Reason*: {{validation_error_message}}
   <{{alert_url}}|View Alert Details>
   ```

### Шаблоны AppBuilder

Директория `appbuilder` содержит шаблоны для Flask-AppBuilder, который используется в Superset для создания административного интерфейса:

1. **general/model/add.html** - шаблон для страницы добавления модели
2. **general/model/edit.html** - шаблон для страницы редактирования модели
3. **general/lib.html** - библиотека общих макросов
4. **general/widgets/list.html** - шаблон для виджета списка

## DODO-специфичные модификации

В DODO модуль `templates` был модифицирован для поддержки русского языка и специфичных для DODO функций:

1. **Локализация**:
   - В шаблонах добавлена поддержка русского языка
   - Добавлены переводы для сообщений об ошибках и уведомлений

2. **Интеграция с системой аутентификации DODO**:
   - В шаблоны добавлена поддержка аутентификации через DODO Authentication Service
   - Добавлена форма для выбора языка:
     ```html
     <div class="selectLanguage">
       <form id="changeLanguage" method="POST" action="/Infrastructure/Home/ChangeCulture">
         <select class="selectLanguage_lang" name="lang" onchange="$.blockUI(); document.getElementById('changeLanguage').submit();">
           <option selected="" value="ru-RU">русский (Россия)</option>
           <option value="en-GB">English (United Kingdom)</option>
         </select>
         <input id="Role" name="Role" type="hidden" value="">
       </form>
     </div>
     ```

3. **Интеграция с системой команд DODO**:
   - В шаблоны добавлена поддержка отображения информации о командах
   - Добавлены шаблоны для страниц управления командами

## Техническая реализация

### Использование шаблонов в представлениях

```python
@appbuilder.app.route("/superset/welcome")
@login_required
def welcome():
    """Renders a welcome page for Superset"""
    return render_template(
        "superset/welcome.html",
        entry="welcome",
        title=_("Welcome"),
        bootstrap_data=json.dumps(
            {
                "user": bootstrap_user_data(g.user, include_perms=True),
            }
        ),
    )
```

### Использование шаблонов в уведомлениях

```python
def _get_notification_content(
    self,
    alert: Alert,
    recipients: list[str],
    notification_type: NotificationType,
) -> dict[str, Any]:
    """
    Gets a notification content based on the alert and notification type.
    """
    content = {}
    template_file = (
        f"slack/alert_no_screenshot.txt"
        if notification_type == NotificationType.TEXT
        else f"slack/alert.txt"
    )
    template = jinja_env.get_template(template_file)
    content["text"] = template.render(
        label=alert.label,
        sql=alert.sql,
        observation_value=alert.observation_value,
        validation_error_message=alert.validation_error_message,
        alert_url=get_url_path("AlertModelView.show", pk=alert.id),
    )
    return content
```

### Использование макросов в шаблонах

```html
{% import "superset/macros.html" as macros %}
{% block tail_js %}
  {{ super() }}
  {{ macros.testconn() }}
  {{ macros.expand_extra_textarea() }}
  {{ macros.expand_encrypted_extra_textarea() }}
  {{ macros.expand_server_cert_textarea() }}
{% endblock %}
```

## Примеры использования

### Рендеринг шаблона

```python
from flask import render_template

def render_dashboard_export():
    """Renders the dashboard export page"""
    return render_template(
        "superset/export_dashboards.html",
        dashboards_url="/superset/dashboards",
    )
```

### Отправка электронного письма с использованием шаблона

```python
from flask_mail import Message
from superset import app, mail

def send_alert_email(alert):
    """Sends an alert email"""
    recipients = ["user@example.com"]
    subject = f"Alert: {alert.label}"

    template = app.jinja_env.get_template("email/alert.txt")
    content = template.render(
        label=alert.label,
        sql=alert.sql,
        observation_value=alert.observation_value,
        validation_error_message=alert.validation_error_message,
        alert_url=f"/superset/alert/{alert.id}",
    )

    msg = Message(subject, recipients=recipients)
    msg.body = content
    mail.send(msg)
```

### Отправка сообщения в Slack с использованием шаблона

```python
import requests
from superset import app

def send_slack_message(alert):
    """Sends a Slack message"""
    webhook_url = "https://hooks.slack.com/services/xxx/yyy/zzz"

    template = app.jinja_env.get_template("slack/alert.txt")
    content = template.render(
        label=alert.label,
        sql=alert.sql,
        observation_value=alert.observation_value,
        validation_error_message=alert.validation_error_message,
        alert_url=f"/superset/alert/{alert.id}",
    )

    payload = {
        "text": content,
        "channel": "#alerts",
        "username": "Superset Alert",
        "icon_emoji": ":chart_with_upwards_trend:",
    }

    requests.post(webhook_url, json=payload)
```

### Использование в DODO

В DODO шаблоны используются для отображения пользовательского интерфейса, отправки уведомлений и генерации отчетов. Примеры использования:

1. **Отображение страницы управления командами**:
   ```python
   @appbuilder.app.route("/superset/teams")
   @login_required
   def teams():
       """Renders the teams page"""
       return render_template(
           "superset/teams.html",
           entry="teams",
           title=_("Teams"),
           bootstrap_data=json.dumps(
               {
                   "user": bootstrap_user_data(g.user, include_perms=True),
                   "teams": get_teams_data(),
               }
           ),
       )
   ```

2. **Отправка уведомления о срабатывании алерта на русском языке**:
   ```python
   def send_alert_notification(alert):
       """Sends an alert notification"""
       template = app.jinja_env.get_template("slack/alert_ru.txt")
       content = template.render(
           label=alert.label,
           sql=alert.sql,
           observation_value=alert.observation_value,
           validation_error_message=alert.validation_error_message,
           alert_url=f"/superset/alert/{alert.id}",
       )

       # Отправка уведомления
       send_notification(content)
   ```

3. **Генерация отчета для команды DODO**:
   ```python
   def generate_team_report(team):
       """Generates a report for a team"""
       template = app.jinja_env.get_template("email/team_report.txt")
       content = template.render(
           team_name=team.name,
           team_members=[user.username for user in team.participants],
           team_dashboards=get_team_dashboards(team),
           report_date=datetime.now().strftime("%Y-%m-%d"),
       )

       # Отправка отчета
       send_report(content, team.participants)
   ```
