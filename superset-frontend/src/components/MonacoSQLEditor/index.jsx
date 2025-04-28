// DODO was here
import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';
import { t, withTheme, css } from '@superset-ui/core';
import ControlHeader from 'src/explore/components/ControlHeader';
import Button from 'src/components/Button';
import ModalTrigger from 'src/components/ModalTrigger';
import { Global } from '@emotion/react';

// Глобальные стили для Monaco Editor
const MonacoGlobalStyles = ({ theme }) => (
  <Global
    styles={css`
      .monaco-editor .margin {
        background-color: ${theme.colors.grayscale.light4};
      }
      .monaco-editor .view-line {
        padding: 2px 0;
      }
      .monaco-editor .current-line {
        border: none !important;
        background-color: ${theme.colors.grayscale.light5} !important;
      }
      .monaco-editor .view-overlays .current-line {
        border: none !important;
        background-color: ${theme.colors.grayscale.light5} !important;
      }
      .monaco-editor .line-numbers {
        color: ${theme.colors.grayscale.base};
      }
      .monaco-editor .mtk1 {
        color: ${theme.colors.grayscale.dark2};
      }
      /* SQL Keywords */
      .monaco-editor .mtk5, .monaco-editor .mtk15 {
        color: ${theme.colors.primary.base};
        font-weight: bold;
      }
      /* SQL Functions */
      .monaco-editor .mtk6 {
        color: ${theme.colors.success.base};
      }
      /* SQL Strings */
      .monaco-editor .mtk8, .monaco-editor .mtk20 {
        color: ${theme.colors.error.base};
      }
      /* SQL Numbers */
      .monaco-editor .mtk7 {
        color: ${theme.colors.info.dark1};
      }
      /* SQL Comments */
      .monaco-editor .mtk4, .monaco-editor .mtk12 {
        color: ${theme.colors.grayscale.light1};
        font-style: italic;
      }
    `}
  />
);

const MonacoSQLEditor = ({
  name,
  onChange,
  initialValue,
  value,
  height,
  minLines,
  maxLines,
  offerEditInModal,
  language,
  aboveEditorSection,
  readOnly,
  resize,
  textAreaStyles,
  theme,
  ...props
}) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Настройка Monaco Editor при монтировании
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Регистрация дополнительных SQL ключевых слов для подсветки
    monaco.languages.setMonarchTokensProvider('sql', {
      defaultToken: '',
      tokenPostfix: '.sql',
      ignoreCase: true,

      brackets: [
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
        { open: '{', close: '}', token: 'delimiter.curly' },
      ],

      keywords: [
        'SELECT', 'FROM', 'WHERE', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'WITH',
        'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
        'FULL', 'CROSS', 'UNION', 'ALL', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER',
        'DROP', 'TABLE', 'VIEW', 'FUNCTION', 'PROCEDURE', 'TRIGGER', 'INDEX', 'CONSTRAINT',
        'PRIMARY', 'FOREIGN', 'KEY', 'REFERENCES', 'UNIQUE', 'CHECK', 'NOT', 'NULL', 'IS',
        'AND', 'OR', 'IN', 'BETWEEN', 'LIKE', 'EXISTS', 'ANY', 'SOME', 'DISTINCT', 'ON',
        'OVER', 'PARTITION', 'ROWS', 'RANGE', 'UNBOUNDED', 'PRECEDING', 'FOLLOWING',
        'CURRENT', 'ROW', 'LIMIT', 'OFFSET', 'TOP', 'PERCENT', 'FETCH', 'NEXT', 'ONLY',
        'GRANT', 'REVOKE', 'CASCADE', 'RESTRICT', 'TRUNCATE', 'VACUUM', 'ANALYZE',
        'EXPLAIN', 'EXECUTE', 'PREPARE', 'DEALLOCATE', 'DECLARE', 'TEMPORARY', 'TEMP',
        'RECURSIVE', 'RETURNING', 'RETURNS', 'LANGUAGE', 'VOLATILE', 'IMMUTABLE', 'STABLE',
        'CALLED', 'INPUT', 'OUTPUT', 'VARIADIC', 'SECURITY', 'DEFINER', 'INVOKER',
        'SETOF', 'COALESCE', 'NULLIF', 'GREATEST', 'LEAST', 'EXTRACT', 'OVERLAY',
        'POSITION', 'SUBSTRING', 'TRIM', 'CONVERT', 'CAST', 'AT', 'TIME', 'ZONE',
        'COLLATE', 'COLLATION', 'USING', 'DEFAULT', 'VALUES', 'TRUE', 'FALSE',
        'WINDOW', 'FIRST', 'LAST', 'FILTER', 'GROUPS', 'EXCLUDE', 'TIES', 'OTHERS',
        'LATERAL', 'ORDINALITY', 'XMLATTRIBUTES', 'XMLCONCAT', 'XMLELEMENT', 'XMLEXISTS',
        'XMLFOREST', 'XMLNAMESPACES', 'XMLPARSE', 'XMLPI', 'XMLROOT', 'XMLSERIALIZE',
        'XMLTABLE', 'JSON', 'JSONB', 'TO_JSON', 'TO_JSONB', 'JSON_BUILD_ARRAY',
        'JSON_BUILD_OBJECT', 'JSON_OBJECT', 'JSON_ARRAY', 'ILIKE', 'SIMILAR',
        'TABLESAMPLE', 'BERNOULLI', 'SYSTEM', 'CUBE', 'ROLLUP', 'GROUPING', 'SETS',
        'MATERIALIZED', 'SCHEMA', 'SCHEMAS', 'DATABASE', 'DATABASES', 'EXTENSION',
        'EXTENSIONS', 'SERVER', 'SERVERS', 'WRAPPER', 'WRAPPERS', 'EVENT', 'TRIGGER',
        'RULE', 'TRANSFORM', 'PUBLICATION', 'SUBSCRIPTION', 'ROUTINE', 'ROUTINES',
        'SEQUENCE', 'SEQUENCES', 'DOMAIN', 'DOMAINS', 'TYPE', 'TYPES', 'OPERATOR',
        'OPERATORS', 'STATISTICS', 'AGGREGATE', 'AGGREGATES', 'COLLATION', 'COLLATIONS',
        'CONVERSION', 'CONVERSIONS', 'TABLESPACE', 'TABLESPACES', 'ACCESS', 'METHOD',
        'METHODS', 'ROLE', 'ROLES', 'USER', 'USERS', 'GROUP', 'GROUPS', 'POLICY',
        'POLICIES', 'FORMAT', 'FAMILY', 'FAMILIES', 'LARGE', 'OBJECT', 'OBJECTS',
        'TEMPLATE', 'TEMPLATES', 'ENCODING', 'LC_COLLATE', 'LC_CTYPE', 'CONNECTION',
        'LIMIT', 'INHERITS', 'STORAGE', 'LOGGED', 'UNLOGGED', 'LOCATION', 'HANDLER',
        'VALIDATOR', 'PARSER', 'OWNER', 'OPTIONS', 'INHERIT', 'DELIMITER', 'DELIMITERS',
        'HEADER', 'QUOTE', 'ESCAPE', 'NULL', 'ENCODING', 'FORCE', 'FREEZE', 'VERBOSE',
        'ANALYZE', 'VACUUM', 'DISABLE', 'ENABLE', 'REPLICA', 'ALWAYS', 'INSTEAD',
        'COMMENT', 'COMMENTS', 'OWNED', 'ATTACH', 'DETACH', 'ISOLATION', 'LEVEL',
        'READ', 'WRITE', 'COMMITTED', 'UNCOMMITTED', 'REPEATABLE', 'SERIALIZABLE',
        'DEFERRABLE', 'IMMEDIATE', 'INITIALLY', 'SESSION', 'LOCAL', 'GLOBAL', 'WORK',
        'TRANSACTION', 'BEGIN', 'START', 'COMMIT', 'ROLLBACK', 'SAVEPOINT', 'RELEASE',
        'PREPARE', 'EXECUTE', 'DEALLOCATE', 'UNLISTEN', 'NOTIFY', 'LOAD', 'LOCK',
        'CLUSTER', 'VACUUM', 'REINDEX', 'RESET', 'DISCARD', 'DEALLOCATE', 'PREPARE',
        'EXECUTE', 'EXPLAIN', 'ANALYZE', 'LISTEN', 'UNLISTEN', 'NOTIFICATION',
        'AUTOINCREMENT', 'IDENTITY', 'GENERATED', 'ALWAYS', 'BY', 'CYCLE', 'NO',
        'CACHE', 'MINVALUE', 'MAXVALUE', 'START', 'INCREMENT', 'RESTART',
        'CONVERT_FROM', 'CONVERT_TO', 'INET_CLIENT_ADDR', 'INET_CLIENT_PORT',
        'INET_SERVER_ADDR', 'INET_SERVER_PORT', 'CURRENT_CATALOG', 'CURRENT_DATABASE',
        'CURRENT_QUERY', 'CURRENT_SCHEMA', 'CURRENT_USER', 'SESSION_USER', 'USER',
        'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'LOCALTIME', 'LOCALTIMESTAMP',
        'CURRENT_ROLE', 'CURRENT_USER', 'SESSION_USER', 'USER', 'SYSTEM_USER',
        'CONVERT_FROM', 'CONVERT_TO', 'INET_CLIENT_ADDR', 'INET_CLIENT_PORT',
        'INET_SERVER_ADDR', 'INET_SERVER_PORT', 'CURRENT_CATALOG', 'CURRENT_DATABASE',
        'CURRENT_QUERY', 'CURRENT_SCHEMA', 'CURRENT_USER', 'SESSION_USER', 'USER',
        'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'LOCALTIME', 'LOCALTIMESTAMP',
        'CURRENT_ROLE', 'CURRENT_USER', 'SESSION_USER', 'USER', 'SYSTEM_USER',
        'DATETIME', 'TIMESTAMP', 'DATE', 'TIME', 'INTERVAL', 'YEAR', 'MONTH', 'DAY',
        'HOUR', 'MINUTE', 'SECOND', 'ZONE', 'PRECISION', 'DECIMAL', 'DEC', 'NUMERIC',
        'REAL', 'DOUBLE', 'FLOAT', 'INT', 'INTEGER', 'SMALLINT', 'BIGINT', 'BIT',
        'VARYING', 'CHARACTER', 'CHAR', 'VARCHAR', 'TEXT', 'BYTEA', 'BOOLEAN', 'BOOL',
        'ENUM', 'CIDR', 'INET', 'MACADDR', 'MACADDR8', 'MONEY', 'TSVECTOR', 'TSQUERY',
        'UUID', 'XML', 'JSON', 'JSONB', 'INT4RANGE', 'INT8RANGE', 'NUMRANGE',
        'TSRANGE', 'TSTZRANGE', 'DATERANGE', 'ARRAY', 'COMPOSITE', 'RANGE', 'MULTIRANGE',
        'POLYGON', 'POINT', 'LINE', 'LSEG', 'BOX', 'PATH', 'CIRCLE', 'PG_LSN',
        'REGCLASS', 'REGCONFIG', 'REGDICTIONARY', 'REGNAMESPACE', 'REGOPER',
        'REGOPERATOR', 'REGPROC', 'REGPROCEDURE', 'REGROLE', 'REGTYPE',
        'CONVERT_FROM', 'CONVERT_TO', 'INET_CLIENT_ADDR', 'INET_CLIENT_PORT',
        'INET_SERVER_ADDR', 'INET_SERVER_PORT', 'CURRENT_CATALOG', 'CURRENT_DATABASE',
        'CURRENT_QUERY', 'CURRENT_SCHEMA', 'CURRENT_USER', 'SESSION_USER', 'USER',
        'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'LOCALTIME', 'LOCALTIMESTAMP',
        'CURRENT_ROLE', 'CURRENT_USER', 'SESSION_USER', 'USER', 'SYSTEM_USER',
        'SUM', 'AVG', 'MIN', 'MAX', 'COUNT', 'STDDEV', 'VARIANCE', 'EVERY', 'SOME',
        'ANY', 'ARRAY_AGG', 'COLLECT', 'CORR', 'COVAR_POP', 'COVAR_SAMP', 'REGR_AVGX',
        'REGR_AVGY', 'REGR_COUNT', 'REGR_INTERCEPT', 'REGR_R2', 'REGR_SLOPE',
        'REGR_SXX', 'REGR_SXY', 'REGR_SYY', 'STDDEV_POP', 'STDDEV_SAMP', 'VAR_POP',
        'VAR_SAMP', 'PERCENTILE_CONT', 'PERCENTILE_DISC', 'RANK', 'DENSE_RANK',
        'PERCENT_RANK', 'CUME_DIST', 'NTILE', 'LAG', 'LEAD', 'FIRST_VALUE',
        'LAST_VALUE', 'NTH_VALUE', 'ROW_NUMBER', 'STRING_AGG', 'ARRAY_AGG',
        'XMLAGG', 'JSONB_AGG', 'JSON_AGG', 'JSONB_OBJECT_AGG', 'JSON_OBJECT_AGG',
        'MODE', 'BIT_AND', 'BIT_OR', 'BIT_XOR', 'BOOL_AND', 'BOOL_OR', 'MEDIAN',
        'CONVERT', 'CAST', 'EXTRACT', 'CEILING', 'CEIL', 'FLOOR', 'ROUND', 'TRUNC',
        'ABS', 'CBRT', 'DEGREES', 'DIV', 'EXP', 'LN', 'LOG', 'MOD', 'PI', 'POWER',
        'RADIANS', 'RANDOM', 'SETSEED', 'SCALE', 'SIGN', 'SQRT', 'WIDTH_BUCKET',
        'ACOS', 'ASIN', 'ATAN', 'ATAN2', 'COS', 'COT', 'SIN', 'TAN', 'BIT_LENGTH',
        'CHAR_LENGTH', 'CHARACTER_LENGTH', 'LOWER', 'UPPER', 'OVERLAY', 'POSITION',
        'SUBSTRING', 'TRIM', 'ASCII', 'BTRIM', 'CHR', 'CONCAT', 'CONCAT_WS', 'FORMAT',
        'INITCAP', 'LEFT', 'LENGTH', 'LPAD', 'LTRIM', 'MD5', 'PARSE_IDENT', 'PG_CLIENT_ENCODING',
        'QUOTE_IDENT', 'QUOTE_LITERAL', 'QUOTE_NULLABLE', 'REGEXP_MATCH', 'REGEXP_MATCHES',
        'REGEXP_REPLACE', 'REGEXP_SPLIT_TO_ARRAY', 'REGEXP_SPLIT_TO_TABLE', 'REPEAT',
        'REPLACE', 'REVERSE', 'RIGHT', 'RPAD', 'RTRIM', 'SPLIT_PART', 'STRPOS',
        'SUBSTR', 'TO_ASCII', 'TO_HEX', 'TRANSLATE', 'AGE', 'CLOCK_TIMESTAMP',
        'DATE_PART', 'DATE_TRUNC', 'ISFINITE', 'JUSTIFY_DAYS', 'JUSTIFY_HOURS',
        'JUSTIFY_INTERVAL', 'MAKE_DATE', 'MAKE_INTERVAL', 'MAKE_TIME', 'MAKE_TIMESTAMP',
        'MAKE_TIMESTAMPTZ', 'NOW', 'STATEMENT_TIMESTAMP', 'TIMEOFDAY', 'TRANSACTION_TIMESTAMP',
        'TO_CHAR', 'TO_DATE', 'TO_NUMBER', 'TO_TIMESTAMP', 'ARRAY_APPEND', 'ARRAY_CAT',
        'ARRAY_DIMS', 'ARRAY_FILL', 'ARRAY_LENGTH', 'ARRAY_LOWER', 'ARRAY_NDIMS',
        'ARRAY_POSITION', 'ARRAY_POSITIONS', 'ARRAY_PREPEND', 'ARRAY_REMOVE',
        'ARRAY_REPLACE', 'ARRAY_TO_STRING', 'ARRAY_UPPER', 'CARDINALITY', 'STRING_TO_ARRAY',
        'UNNEST', 'ISEMPTY', 'LOWER_INC', 'LOWER_INF', 'UPPER_INC', 'UPPER_INF',
        'RANGE_MERGE', 'GENERATE_SERIES', 'GENERATE_SUBSCRIPTS', 'CURRVAL', 'LASTVAL',
        'NEXTVAL', 'SETVAL', 'COALESCE', 'NULLIF', 'GREATEST', 'LEAST', 'XMLCOMMENT',
        'XMLCONCAT', 'XMLELEMENT', 'XMLFOREST', 'XMLPI', 'XMLROOT', 'XMLEXISTS',
        'XML_IS_WELL_FORMED', 'XML_IS_WELL_FORMED_DOCUMENT', 'XML_IS_WELL_FORMED_CONTENT',
        'XPATH', 'XPATH_EXISTS', 'XMLTABLE', 'XMLNAMESPACES', 'TABLE_TO_XML',
        'TABLE_TO_XMLSCHEMA', 'TABLE_TO_XML_AND_XMLSCHEMA', 'QUERY_TO_XML',
        'QUERY_TO_XMLSCHEMA', 'QUERY_TO_XML_AND_XMLSCHEMA', 'CURSOR_TO_XML',
        'CURSOR_TO_XMLSCHEMA', 'SCHEMA_TO_XML', 'SCHEMA_TO_XMLSCHEMA',
        'SCHEMA_TO_XML_AND_XMLSCHEMA', 'DATABASE_TO_XML', 'DATABASE_TO_XMLSCHEMA',
        'DATABASE_TO_XML_AND_XMLSCHEMA', 'XMLPARSE', 'XMLSERIALIZE', 'XMLVALIDATE',
        'TO_JSON', 'TO_JSONB', 'ARRAY_TO_JSON', 'ROW_TO_JSON', 'JSON_BUILD_ARRAY',
        'JSONB_BUILD_ARRAY', 'JSON_BUILD_OBJECT', 'JSONB_BUILD_OBJECT', 'JSON_OBJECT',
        'JSONB_OBJECT', 'JSON_ARRAY_LENGTH', 'JSONB_ARRAY_LENGTH', 'JSON_EACH',
        'JSONB_EACH', 'JSON_EACH_TEXT', 'JSONB_EACH_TEXT', 'JSON_EXTRACT_PATH',
        'JSONB_EXTRACT_PATH', 'JSON_EXTRACT_PATH_TEXT', 'JSONB_EXTRACT_PATH_TEXT',
        'JSON_OBJECT_KEYS', 'JSONB_OBJECT_KEYS', 'JSON_POPULATE_RECORD',
        'JSONB_POPULATE_RECORD', 'JSON_POPULATE_RECORDSET', 'JSONB_POPULATE_RECORDSET',
        'JSON_ARRAY_ELEMENTS', 'JSONB_ARRAY_ELEMENTS', 'JSON_ARRAY_ELEMENTS_TEXT',
        'JSONB_ARRAY_ELEMENTS_TEXT', 'JSON_TYPEOF', 'JSONB_TYPEOF', 'JSON_TO_RECORD',
        'JSONB_TO_RECORD', 'JSON_TO_RECORDSET', 'JSONB_TO_RECORDSET', 'JSON_STRIP_NULLS',
        'JSONB_STRIP_NULLS', 'JSONB_SET', 'JSONB_INSERT', 'JSONB_PRETTY',
        'CONVERT_FROM', 'CONVERT_TO', 'PG_CLIENT_ENCODING',
      ],

      operators: [
        '=', '>', '<', '>=', '<=', '<>', '!=', '!<', '!>', '+', '-', '*', '/', '%', '^', '&', '|', '#', '~', '<<', '>>', '&&', '||', '?', '?|', '?&', '@>', '<@', '?#', '@@', '#-', '@?', '@@', '##', '<->', '->>', '->', '~=', '~', '!~', '!~*', '~*', '!~~', '!~~*', '~~', '~~*',
      ],

      builtinFunctions: [
        'ABS', 'ACOS', 'ASIN', 'ATAN', 'ATAN2', 'AVG', 'CAST', 'CEILING', 'COALESCE', 'CONCAT', 'COS', 'COT', 'COUNT', 'DATE_PART', 'DATE_TRUNC', 'EXTRACT', 'FLOOR', 'GREATEST', 'LEAST', 'LENGTH', 'LOWER', 'LPAD', 'LTRIM', 'MAX', 'MIN', 'MOD', 'NOW', 'NULLIF', 'POSITION', 'POWER', 'RANDOM', 'ROUND', 'RPAD', 'RTRIM', 'SIGN', 'SIN', 'SQRT', 'SUBSTRING', 'SUM', 'TAN', 'TRIM', 'TRUNC', 'UPPER',
      ],

      builtinVariables: [
        'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER', 'SESSION_USER', 'SYSTEM_USER', 'USER',
      ],

      pseudoColumns: [
        'ROWCOUNT', 'ROWGUIDCOL', 'IDENTITY',
      ],

      tokenizer: {
        root: [
          { include: '@comments' },
          { include: '@whitespace' },
          { include: '@numbers' },
          { include: '@strings' },
          { include: '@complexIdentifiers' },
          { include: '@scopes' },
          [/[;,.]/, 'delimiter'],
          [/[()]/, '@brackets'],
          [/[\w@#$]+/, {
            cases: {
              '@keywords': 'keyword',
              '@operators': 'operator',
              '@builtinVariables': 'predefined',
              '@builtinFunctions': 'predefined',
              '@pseudoColumns': 'predefined',
              '@default': 'identifier'
            }
          }],
          [/[<>=!%&+\-*/|~^]/, 'operator'],
        ],
        whitespace: [
          [/\s+/, 'white']
        ],
        comments: [
          [/--+.*/, 'comment'],
          [/\/\*/, { token: 'comment.quote', next: '@comment' }]
        ],
        comment: [
          [/[^*/]+/, 'comment'],
          [/\*\//, { token: 'comment.quote', next: '@pop' }],
          [/./, 'comment']
        ],
        numbers: [
          [/0[xX][0-9a-fA-F]*/, 'number'],
          [/[$][+-]*\d*(\.\d*)?/, 'number'],
          [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number']
        ],
        strings: [
          [/'/, { token: 'string', next: '@string' }],
          [/"/, { token: 'string.double', next: '@stringDouble' }]
        ],
        string: [
          [/[^']+/, 'string'],
          [/''/, 'string'],
          [/'/, { token: 'string', next: '@pop' }]
        ],
        stringDouble: [
          [/[^"]+/, 'string.double'],
          [/""/, 'string.double'],
          [/"/, { token: 'string.double', next: '@pop' }]
        ],
        complexIdentifiers: [
          [/\[/, { token: 'identifier.quote', next: '@bracketedIdentifier' }],
          [/"/, { token: 'identifier.quote', next: '@quotedIdentifier' }]
        ],
        bracketedIdentifier: [
          [/[^\]]+/, 'identifier'],
          [/]]/, 'identifier'],
          [/]/, { token: 'identifier.quote', next: '@pop' }]
        ],
        quotedIdentifier: [
          [/[^"]+/, 'identifier'],
          [/""/, 'identifier'],
          [/"/, { token: 'identifier.quote', next: '@pop' }]
        ],
        scopes: [
          [/BEGIN\s+DISTRIBUTED\s+TRANSACTION/, { token: 'keyword' }],
          [/BEGIN\s+TRANSACTION/, { token: 'keyword' }],
          [/BEGIN/, { token: 'keyword' }],
          [/END/, { token: 'keyword' }],
        ]
      }
    });
  };

  const handleChange = (newValue) => {
    onChange(newValue);
  };

  // Определяем высоту редактора
  const editorHeight = resize === 'vertical' || resize === 'both'
    ? height || 250
    : minLines ? `${minLines * 18}px` : '250px';

  const renderEditor = (inModal = false) => {
    const modalHeight = inModal ? '70vh' : editorHeight;
    const editorValue = value || initialValue || '';

    return (
      <>
        <MonacoGlobalStyles theme={theme} />
        <div
          style={{
            border: `1px solid ${theme.colors.grayscale.light1}`,
            borderRadius: '4px',
            ...(resize ? { resize } : {}),
            overflow: 'hidden',
            ...textAreaStyles,
          }}
        >
          <Editor
            height={modalHeight}
            value={editorValue}
            language={language || 'sql'}
            theme="vs-light"
            onChange={handleChange}
            onMount={handleEditorDidMount}
            options={{
              readOnly,
              minimap: {
                enabled: inModal || editorValue.length > 500,
                showSlider: 'mouseover',
              },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              folding: true,
              foldingStrategy: 'indentation',
              wordWrap: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              matchBrackets: 'always',
              autoIndent: 'full',
              formatOnPaste: true,
              formatOnType: true,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 12,
                horizontalScrollbarSize: 12,
                alwaysConsumeMouseWheel: false,
              },
              fontSize: 12,
              fontFamily: 'Menlo, Consolas, "Courier New", monospace',
              colorDecorators: true,
              contextmenu: true,
              tabSize: 2,
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showWords: true,
                showFunctions: true,
                preview: true,
              },
              hover: {
                enabled: true,
                delay: 300,
              },
              find: {
                addExtraSpaceOnTop: false,
                autoFindInSelection: 'never',
                seedSearchStringFromSelection: 'always',
              },
              links: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: true,
              smoothScrolling: true,
              mouseWheelZoom: true,
              bracketPairColorization: {
                enabled: true,
              },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
            }}
          />
        </div>
      </>
    );
  };

  const renderModalBody = () => (
    <>
      <div>{aboveEditorSection}</div>
      {renderEditor(true)}
    </>
  );

  return (
    <div>
      <ControlHeader {...props} />
      {renderEditor()}
      {offerEditInModal && (
        <ModalTrigger
          modalTitle={<ControlHeader {...props} />}
          triggerNode={
            <Button buttonSize="small" className="m-t-5">
              {t('Edit')} <strong>{language || 'sql'}</strong>{' '}
              {t('in modal')}
            </Button>
          }
          modalBody={renderModalBody()}
          responsive
          maxWidth="90%"
        />
      )}
    </div>
  );
};

MonacoSQLEditor.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  initialValue: PropTypes.string,
  value: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minLines: PropTypes.number,
  maxLines: PropTypes.number,
  offerEditInModal: PropTypes.bool,
  language: PropTypes.oneOf([
    null,
    'json',
    'html',
    'sql',
    'markdown',
    'javascript',
  ]),
  aboveEditorSection: PropTypes.node,
  readOnly: PropTypes.bool,
  resize: PropTypes.oneOf([
    null,
    'block',
    'both',
    'horizontal',
    'inline',
    'none',
    'vertical',
  ]),
  textAreaStyles: PropTypes.object,
  theme: PropTypes.object,
};

MonacoSQLEditor.defaultProps = {
  onChange: () => {},
  initialValue: '',
  height: 250,
  minLines: 3,
  maxLines: 10,
  offerEditInModal: true,
  readOnly: false,
  resize: null,
  textAreaStyles: {},
};

export default withTheme(MonacoSQLEditor);
